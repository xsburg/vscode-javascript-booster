import {
    ArrowFunctionExpression,
    AstNode,
    BlockStatement,
    Expression,
    ExpressionStatement,
    FunctionDeclaration,
    Identifier,
    IfStatement,
    Printable,
    ReturnStatement,
    UnaryExpression,
    VariableDeclarator,
} from 'ast-types';
import { Collection, JsCodeShift } from 'jscodeshift';

import { CodeModExports } from '../codeModTypes';

const codeMod: CodeModExports = ((fileInfo, api, options) => {
    const j = api.jscodeshift;
    const ast = fileInfo.ast;
    const target = options.target;
    const $variableDeclaration = target.thisOrClosest(j.VariableDeclaration);

    const varDecl = $variableDeclaration.firstNode()!;
    const fnName = ((varDecl.declarations[0] as VariableDeclarator).id as Identifier).name;
    const arrowExpr = (varDecl.declarations[0] as VariableDeclarator)
        .init as ArrowFunctionExpression;
    const body = j.BlockStatement.check(arrowExpr.body)
        ? arrowExpr.body
        : j.blockStatement([j.returnStatement(arrowExpr.body)]);

    const resultFn = j.functionDeclaration(j.identifier(fnName), arrowExpr.params, body);
    resultFn.comments = varDecl.comments;
    resultFn.returnType = arrowExpr.returnType;
    resultFn.generator = arrowExpr.generator;
    $variableDeclaration.replaceWith(resultFn);

    const resultText = ast.toSource();
    return resultText;
}) as CodeModExports;

codeMod.canRun = (fileInfo, api, options) => {
    const j = api.jscodeshift;
    const ast = fileInfo.ast;
    const target = options.target;
    const path = target.firstPath();

    // convert-arrow-fn-to-regular-fn:should-trigger-on-var-declaration
    if (!path) {
        return false;
    }

    let checkTarget: AstNode | undefined;
    if (j.Identifier.check(path.node) && j.VariableDeclarator.check(path.parent.node)) {
        checkTarget = path.parent.parent?.node;
    } else if (j.ArrowFunctionExpression.check(path.node)) {
        checkTarget = path.parent.parent?.node;
    } else if (j.VariableDeclarator.check(path.node)) {
        checkTarget = path.parent.node;
    } else if (j.VariableDeclaration.check(path.node)) {
        checkTarget = path.node;
    }
    if (!checkTarget) {
        return false;
    }
    const allPreconditionsMet =
        // Check VariableDeclaration
        j.VariableDeclaration.check(checkTarget) &&
        checkTarget.declarations.length === 1 &&
        // Check VariableDeclarator
        j.VariableDeclarator.check(checkTarget.declarations[0]) &&
        j.Identifier.check(checkTarget.declarations[0].id) &&
        j.ArrowFunctionExpression.check(checkTarget.declarations[0].init);
    if (!allPreconditionsMet) {
        return false;
    }
    const usesThisExpr = j(checkTarget).find(j.ThisExpression).length > 0;
    return !usesThisExpr;
};

codeMod.scope = 'cursor';

codeMod.title = 'Convert to regular function';

codeMod.description = '';

codeMod.detail = '';

module.exports = codeMod;
