import {
    ArrowFunctionExpression,
    AssignmentExpression,
    AstNode,
    BlockStatement,
    FunctionDeclaration,
    FunctionExpression,
    NodePath,
    StringLiteral,
    TSEnumDeclaration,
    VariableDeclaration,
    VariableDeclarator,
} from 'ast-types';
import { JsCodeShift } from 'jscodeshift';

import { codeActionsRequestHandler } from '../codeActionsRequest';
import { CodeModExports } from '../codeModTypes';
import { isValidHookLocation } from '../utils/react';

function getVariableDeclaration(
    path: NodePath<AstNode>,
    j: JsCodeShift
): NodePath<VariableDeclaration> | null {
    let checkTarget: NodePath<AstNode> | undefined;
    if (j.Identifier.check(path.node) && j.VariableDeclarator.check(path.parent.node)) {
        // const fo|o = () => {};
        checkTarget = path.parent.parent;
    } else if (
        j.ArrowFunctionExpression.check(path.node) ||
        j.FunctionExpression.check(path.node)
    ) {
        // const foo = () =|> {};
        // const foo = functi|on() {};
        checkTarget = path.parent.parent;
    } else if (j.VariableDeclarator.check(path.node)) {
        // const foo |= () => {};
        checkTarget = path.parent;
    } else if (j.VariableDeclaration.check(path.node)) {
        // co|nst foo = () => {};
        checkTarget = path;
    }
    if (!checkTarget) {
        return null;
    }
    const preconditionsMet =
        // Check VariableDeclaration
        j.VariableDeclaration.check(checkTarget.node) &&
        checkTarget.node.declarations.length === 1 &&
        // Check VariableDeclarator
        j.VariableDeclarator.check(checkTarget.node.declarations[0]) &&
        j.Identifier.check(checkTarget.node.declarations[0].id) &&
        (j.ArrowFunctionExpression.check(checkTarget.node.declarations[0].init) ||
            j.FunctionExpression.check(checkTarget.node.declarations[0].init));
    if (!preconditionsMet) {
        return null;
    }
    return checkTarget as any;
}

function getFunctionDeclaration(
    path: NodePath<AstNode>,
    j: JsCodeShift
): NodePath<FunctionDeclaration> | null {
    if (j.Identifier.check(path.node) && j.FunctionDeclaration.check(path.parent.node)) {
        // function fo|o() {};
        return path.parent as any;
    } else if (j.FunctionDeclaration.check(path.node)) {
        // funct|ion foo() {};
        return path as any;
    }
    return null;
}

function getAssignmentExpression(
    path: NodePath<AstNode>,
    j: JsCodeShift
): NodePath<AssignmentExpression> | null {
    let checkTarget: NodePath<AstNode> | undefined;
    if (j.Identifier.check(path.node) && j.AssignmentExpression.check(path.parent.node)) {
        // fo|o = () => {};
        checkTarget = path.parent;
    } else if (
        j.ArrowFunctionExpression.check(path.node) ||
        j.FunctionExpression.check(path.node)
    ) {
        // foo = () =|> {};
        // foo = functi|on() {};
        checkTarget = path.parent;
    } else if (j.AssignmentExpression.check(path.node)) {
        // foo |= () => {};
        checkTarget = path;
    }
    if (!checkTarget) {
        return null;
    }
    const preconditionsMet =
        j.AssignmentExpression.check(checkTarget.node) &&
        j.ExpressionStatement.check(checkTarget.parent.node) &&
        checkTarget.node.operator === '=' &&
        j.Identifier.check(checkTarget.node.left) &&
        (j.ArrowFunctionExpression.check(checkTarget.node.right) ||
            j.FunctionExpression.check(checkTarget.node.right));
    if (!preconditionsMet) {
        return null;
    }
    return checkTarget as any;
}

const codeMod: CodeModExports = ((fileInfo, api, options) => {
    const j = api.jscodeshift;
    const ast = fileInfo.ast;
    const target = options.target;
    const path = target.firstPath()!;

    let functionDeclaration = getFunctionDeclaration(path, j);
    let variableDeclaration = getVariableDeclaration(path, j);
    let assignmentExpression = getAssignmentExpression(path, j);

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
        getFunctionDeclaration(path, j) ||
            getVariableDeclaration(path, j) ||
            getAssignmentExpression(path, j)
    );
};

codeMod.scope = 'cursor';

codeMod.title = 'Wrap function into useCallback() hook';

codeMod.description = '';

codeMod.detail = '';

module.exports = codeMod;
