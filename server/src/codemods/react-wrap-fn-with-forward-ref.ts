import {
    ArrowFunctionExpression,
    FunctionExpression,
    Identifier,
    TSQualifiedName,
    TSType,
    TSTypeAnnotation,
    TSTypeReference,
    VariableDeclarator,
} from 'ast-types';

import { CodeModExports } from '../codeModTypes';
import { getFunctionDeclaration, getVariableDeclaration } from '../utils/function';
import { getPropsTypeFromVariableDeclaratorId, isReactComponentName } from '../utils/react';

const codeMod: CodeModExports = ((fileInfo, api, options) => {
    const j = api.jscodeshift;
    const ast = fileInfo.ast;
    const target = options.target;
    const path = target.firstPath()!;

    let functionDeclaration = getFunctionDeclaration(j, path);
    let variableDeclaration = getVariableDeclaration(j, path);

    function createUseCallbackWrapper(
        fnExpr: ArrowFunctionExpression | FunctionExpression,
        propsType: TSType | null
    ) {
        const callExpr = j.callExpression(j.identifier('forwardRef'), [fnExpr]);
        if (propsType) {
            callExpr.typeParameters = j.tsTypeParameterInstantiation([j.tsAnyKeyword(), propsType]);
        }
        return j.memberExpression(j.identifier('React'), callExpr);
    }

    if (functionDeclaration) {
        const oldFuncDecl = functionDeclaration.node;
        // Replace function Foo(props: Props) {} WITH const onClick = React.forwardRef<any, Props>((props, ref) => {});

        // 1. Extract propsType & propsParam
        let propsType = null;
        let propsParam;
        if (oldFuncDecl.params.length > 0) {
            const firstParam = oldFuncDecl.params[0];
            if (j.Identifier.check(firstParam) || j.ObjectPattern.check(firstParam)) {
                propsType = firstParam.typeAnnotation
                    ? firstParam.typeAnnotation.typeAnnotation
                    : null;
                firstParam.typeAnnotation = null;
                propsParam = firstParam;
            }
        }
        if (!propsParam) {
            propsParam = j.identifier('props');
        }
        // 2. Build new statement
        const newNode = j.variableDeclaration('const', [
            j.variableDeclarator(
                j.identifier(oldFuncDecl.id.name),
                createUseCallbackWrapper(
                    j.arrowFunctionExpression([propsParam, j.identifier('ref')], oldFuncDecl.body),
                    propsType
                )
            ),
        ]);
        newNode.comments = oldFuncDecl.comments;
        if (j.ExportDefaultDeclaration.check(functionDeclaration.parent.node)) {
            // Special case: export default function() {} => 2 statements (var declaration, then export default)
            functionDeclaration.parent.insertAfter(
                j.exportDefaultDeclaration(j.identifier(oldFuncDecl.id.name))
            );
            functionDeclaration.parent.replace(newNode);
        } else {
            functionDeclaration.replace(newNode);
        }
    } else if (variableDeclaration) {
        const variableDeclarator = variableDeclaration.node.declarations[0] as VariableDeclarator;
        const variableDeclaratorId = variableDeclarator.id as Identifier;
        // Replace const Foo = (props: Props) => {} WITH const Foo = React.forwardRef<any, Props>((props) => {});
        const fnExpr = variableDeclarator.init as ArrowFunctionExpression | FunctionExpression;
        // 1. Update fn parameters
        let propsType = null;
        if (fnExpr.params.length === 1) {
            const firstParam = fnExpr.params[0];
            if (j.Identifier.check(firstParam) || j.ObjectPattern.check(firstParam)) {
                propsType = firstParam.typeAnnotation
                    ? firstParam.typeAnnotation.typeAnnotation
                    : null;
                firstParam.typeAnnotation = null;
            }
            fnExpr.params.push(j.identifier('ref'));
        } else {
            fnExpr.params = [j.identifier('props'), j.identifier('ref')];
        }
        if (!propsType) {
            propsType = getPropsTypeFromVariableDeclaratorId(j, variableDeclaratorId);
        }
        // 2. Wrap the function
        variableDeclaratorId.typeAnnotation = null;
        variableDeclarator.init = createUseCallbackWrapper(fnExpr, propsType);
    }

    const resultText = ast.toSource();
    return resultText;
}) as CodeModExports;

codeMod.canRun = (fileInfo, api, options) => {
    const j = api.jscodeshift;
    const target = options.target;
    const path = target.firstPath();

    if (!path) {
        return false;
    }

    const fnDecl = getFunctionDeclaration(j, path);
    if (fnDecl && isReactComponentName(fnDecl.node.id)) {
        return true;
    }

    const varDecl = getVariableDeclaration(j, path);
    if (varDecl && isReactComponentName((varDecl.node.declarations[0] as VariableDeclarator).id)) {
        return true;
    }

    return false;
};

codeMod.scope = 'cursor';

codeMod.languageScope = ['javascriptreact', 'typescriptreact'];

codeMod.title = 'Wrap component into React.forwardRef()';

codeMod.description = '';

codeMod.detail = '';

module.exports = codeMod;
