import {
    ArrowFunctionExpression,
    FunctionExpression,
    Identifier,
    TSType,
    VariableDeclarator,
} from 'ast-types';

import { CodeModExports } from '../codeModTypes';
import { getFunctionDeclaration, getVariableDeclaration } from '../utils/function';
import { isReactComponentName } from '../utils/react';

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
        const callExpr = j.callExpression(j.identifier('memo'), [fnExpr]);
        if (propsType) {
            callExpr.typeParameters = j.tsTypeParameterInstantiation([propsType]);
        }
        return j.memberExpression(j.identifier('React'), callExpr);
    }

    if (functionDeclaration) {
        const oldFuncDecl = functionDeclaration.node;
        // Replace function Foo(props: Props) {} WITH const onClick = React.memo<Props>((props, ref) => {});

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
                    j.arrowFunctionExpression([propsParam], oldFuncDecl.body),
                    propsType
                )
            ),
        ]);
        newNode.comments = oldFuncDecl.comments;
        functionDeclaration.replace(newNode);
    } else if (variableDeclaration) {
        const variableDeclarator = variableDeclaration.node.declarations[0] as VariableDeclarator;
        // Replace const Foo = (props: Props) => {} WITH const Foo = React.memo<Props>((props) => {});
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
        } else {
            fnExpr.params = [j.identifier('props')];
        }
        // 2. Wrap the function
        (variableDeclarator.id as Identifier).typeAnnotation = null;
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

codeMod.title = 'Wrap component into React.memo()';

codeMod.description = '';

codeMod.detail = '';

module.exports = codeMod;
