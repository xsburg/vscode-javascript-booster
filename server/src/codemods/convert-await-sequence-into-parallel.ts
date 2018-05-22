import {
    ArrowFunctionExpression,
    AstNode,
    AwaitExpression,
    BlockStatement,
    Expression,
    ExpressionStatement,
    FunctionDeclaration,
    IfStatement,
    Printable,
    UnaryExpression
} from 'ast-types';
import { Collection, JsCodeShift } from 'jscodeshift';
import { CodeModExports } from '../codeModTypes';

function isAwaitStatement(j: JsCodeShift, stmt: AstNode) {
    return (
        stmt &&
        j.match(stmt, {
            type: 'ExpressionStatement',
            expression: {
                type: 'AwaitExpression'
            }
        } as any)
    );
}

const codeMod: CodeModExports = (fileInfo, api, options) => {
    const j = api.jscodeshift;
    const ast = fileInfo.ast;
    const target = options.target;
    const path = target.firstPath()!;

    const targetStmt = path.parent.node as ExpressionStatement;
    const block = path.parent.parent.node as BlockStatement;
    let sequence = [];
    const index = block.body.indexOf(targetStmt);
    let startIndex = index;
    while (startIndex > 0 && isAwaitStatement(j, block.body[startIndex - 1])) {
        startIndex--;
    }
    let endIndex = index;
    while (endIndex < block.body.length - 1 && isAwaitStatement(j, block.body[endIndex + 1])) {
        endIndex++;
    }

    const items = block.body
        .slice(startIndex, endIndex + 1)
        .map(n => ((n as ExpressionStatement).expression as AwaitExpression).argument!);

    const newStatement = j.expressionStatement(
        j.awaitExpression(
            j.callExpression(j.memberExpression(j.identifier('Promise'), j.identifier('all')), [
                j.arrayExpression(items)
            ])
        )
    );
    block.body.splice(startIndex, endIndex - startIndex + 1, newStatement);

    const resultText = ast.toSource();
    return resultText;
};

codeMod.canRun = (fileInfo, api, options) => {
    const j = api.jscodeshift;
    const target = options.target;
    const path = target.firstPath();

    if (!path) {
        return false;
    }

    const isAwaitStmt =
        j.AwaitExpression.check(path.node) &&
        j.ExpressionStatement.check(path.parent.node) &&
        j.BlockStatement.check(path.parent.parent.node);
    if (!isAwaitStmt) {
        return false;
    }

    const stmt = path.parent.node as ExpressionStatement;
    const block = path.parent.parent.node as BlockStatement;
    const index = block.body.indexOf(stmt);
    const prevStmt = block.body[index - 1];
    if (isAwaitStatement(j, prevStmt)) {
        return true;
    }
    const nextStmt = block.body[index + 1];
    if (isAwaitStatement(j, nextStmt)) {
        return true;
    }

    return false;
};

codeMod.scope = 'cursor';

codeMod.title = 'Call in parallel with Promise.All()';

codeMod.description = '';

codeMod.detail = '';

module.exports = codeMod;
