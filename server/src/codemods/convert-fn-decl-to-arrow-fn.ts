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

    let functionDeclaration = getFunctionDeclaration(j, path)!;
    const oldFuncDecl = functionDeclaration.node;
    const newArrowFn = j.arrowFunctionExpression(oldFuncDecl.params, oldFuncDecl.body);
    const newNode = j.variableDeclaration('const', [
        j.variableDeclarator(j.identifier(oldFuncDecl.id.name), newArrowFn),
    ]);
    newArrowFn.async = oldFuncDecl.async;
    newArrowFn.returnType = oldFuncDecl.returnType;
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
        newNode.comments = oldFuncDecl.comments;
        functionDeclaration.replace(newNode);
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

    return Boolean(getFunctionDeclaration(j, path));
};

codeMod.scope = 'cursor';

codeMod.title = 'Convert to arrow function';

codeMod.description = '';

codeMod.detail = '';

module.exports = codeMod;
