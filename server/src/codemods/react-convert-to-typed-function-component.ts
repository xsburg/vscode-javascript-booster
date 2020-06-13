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

    function withTypeAnnotation(identifier: Identifier, propsType: TSType | null) {
        if (!propsType) {
            propsType = j.tsAnyKeyword();
        }
        identifier.typeAnnotation = j.tsTypeAnnotation(
            j.tsTypeReference(
                j.tsQualifiedName(j.identifier('React'), j.identifier('FunctionComponent')),
                j.tsTypeParameterInstantiation([propsType])
            )
        );
        return identifier;
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
                withTypeAnnotation(j.identifier(oldFuncDecl.id.name), propsType),
                j.arrowFunctionExpression([propsParam], oldFuncDecl.body)
            ),
        ]);
        newNode.comments = oldFuncDecl.comments;
        if (j.ExportDefaultDeclaration.check(functionDeclaration.parent.node)) {
            // Special case: export default function() {} => 2 statements (var declaration, then export default)
            const newExportDecl = j.exportDefaultDeclaration(j.identifier(oldFuncDecl.id.name));
            newExportDecl.comments = (functionDeclaration.parent.node.comments || []).filter(
                (c) => c.trailing
            );
            newNode.comments = (functionDeclaration.parent.node.comments || []).filter(
                (c) => c.leading
            );
            functionDeclaration.parent.insertAfter(newExportDecl);
            functionDeclaration.parent.replace(newNode);
        } else {
            functionDeclaration.replace(newNode);
        }
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
        withTypeAnnotation(variableDeclarator.id as Identifier, propsType);
        variableDeclarator.init = fnExpr;
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
    if (varDecl) {
        const varDeclId = (varDecl.node.declarations[0] as VariableDeclarator).id;
        if (isReactComponentName(varDeclId) && !varDeclId.typeAnnotation) {
            // Is function declaration without types
            return true;
        }
    }

    return false;
};

codeMod.scope = 'cursor';

codeMod.languageScope = ['typescriptreact'];

codeMod.title = 'Convert to React.FunctionComponent<Props> declaration';

codeMod.description = '';

codeMod.detail = '';

module.exports = codeMod;
