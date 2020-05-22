import { ArrowFunctionExpression, FunctionExpression, VariableDeclarator } from 'ast-types';

import { CodeModExports } from '../codeModTypes';
import {
    getAssignmentExpression,
    getFunctionDeclaration,
    getVariableDeclaration,
} from '../utils/function';
import { isValidHookLocation } from '../utils/react';

const codeMod: CodeModExports = ((fileInfo, api, options) => {
    const j = api.jscodeshift;
    const ast = fileInfo.ast;
    const target = options.target;
    const path = target.firstPath()!;

    let functionDeclaration = getFunctionDeclaration(j, path);
    let variableDeclaration = getVariableDeclaration(j, path);
    let assignmentExpression = getAssignmentExpression(j, path);

    function createUseCallbackWrapper(fnExpr: ArrowFunctionExpression | FunctionExpression) {
        return j.callExpression(j.identifier('useCallback'), [fnExpr, j.arrayExpression([])]);
    }

    if (functionDeclaration) {
        const oldFuncExpr = functionDeclaration.node;
        // Replace function onClick() {} WITH const onClick = useCallback(() => {}, []);
        const newFuncExpr = j.arrowFunctionExpression(oldFuncExpr.params, oldFuncExpr.body);
        newFuncExpr.returnType = oldFuncExpr.returnType;
        newFuncExpr.typeParameters = oldFuncExpr.typeParameters;
        const newNode = j.variableDeclaration('const', [
            j.variableDeclarator(
                j.identifier(oldFuncExpr.id.name),
                createUseCallbackWrapper(newFuncExpr)
            ),
        ]);
        newNode.comments = oldFuncExpr.comments;
        functionDeclaration.replace(newNode);
    } else if (variableDeclaration) {
        const variableDeclarator = variableDeclaration.node.declarations[0] as VariableDeclarator;
        // Replace const onClick = () => {} WITH const onClick = useCallback(() => {}, []);
        const functionExpr = variableDeclarator.init as
            | ArrowFunctionExpression
            | FunctionExpression;
        variableDeclarator.init = createUseCallbackWrapper(functionExpr);
    } else if (assignmentExpression) {
        // Replace onClick = () => {} WITH onClick = useCallback(() => {}, []);
        const functionExpr = assignmentExpression.node.right as
            | ArrowFunctionExpression
            | FunctionExpression;
        assignmentExpression.node.right = createUseCallbackWrapper(functionExpr);
    }

    const resultText = ast.toSource();
    return resultText;
}) as CodeModExports;

codeMod.canRun = (fileInfo, api, options) => {
    const j = api.jscodeshift;
    const target = options.target;
    const path = target.firstPath();

    if (!path || !isValidHookLocation(path)) {
        return false;
    }

    return Boolean(
        getFunctionDeclaration(j, path) ||
            getVariableDeclaration(j, path) ||
            getAssignmentExpression(j, path)
    );
};

codeMod.scope = 'cursor';

codeMod.title = 'Wrap function into useCallback() hook';

codeMod.description = '';

codeMod.detail = '';

module.exports = codeMod;
