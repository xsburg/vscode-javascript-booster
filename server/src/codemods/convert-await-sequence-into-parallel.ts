import {
    AssignmentExpression,
    AstNode,
    AwaitExpression,
    BlockStatement,
    ExpressionStatement,
    Statement,
    VariableDeclaration,
    VariableDeclarator
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

const codeMod: CodeModExports = ((fileInfo, api, options) => {
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
}) as CodeModExports;

function getContainingStatement(
    j: JsCodeShift,
    c: Collection<AstNode>
): Collection<Statement> | null {
    const s = c.thisOrClosest(j.Statement);
    if (
        j.match<ExpressionStatement>(s, {
            type: 'ExpressionStatement',
            expression: {
                type: 'AwaitExpression'
            } as AssignmentExpression
        })
    ) {
        // Example: 'await foo();'
        return s;
    }
    if (
        j.match<ExpressionStatement>(s, {
            type: 'ExpressionStatement',
            expression: {
                type: 'AssignmentExpression',
                right: {
                    type: 'AwaitExpression'
                }
            } as AssignmentExpression
        })
    ) {
        // Example: 'result = await foo();'
        return s;
    }
    if (
        j.match<VariableDeclaration>(s, {
            type: 'VariableDeclaration',
            declarations: [
                {
                    type: 'VariableDeclarator',
                    init: {
                        type: 'AwaitExpression'
                    }
                } as VariableDeclarator
            ]
        })
    ) {
        // Example: 'let result = await foo();'
        return s;
    }
    return null;
}

codeMod.canRun = (fileInfo, api, options) => {
    const j = api.jscodeshift;
    const target = options.target;
    const path = target.firstPath();

    if (!path) {
        return false;
    }

    if (options.selection.anchor === options.selection.active) {
        // Works on range selections only
        return false;
    }

    const s1 = getContainingStatement(j, options.target);
    if (!s1) {
        return false;
    }

    const s2 = getContainingStatement(j, options.anchorTarget);
    if (!s2) {
        return false;
    }

    const s1Parent = s1.parents()[0];
    const s2Parent = s2.parents()[0];
    if (!j.BlockStatement.check(s1Parent) || s1Parent !== s2Parent) {
        // Block statement mismatch
        return false;
    }

    const from = s1Parent.body.indexOf(s1.firstNode()!);
    const to = s1Parent.body.indexOf(s2.firstNode()!);
    for (let i = from + 1; i < to; i++) {
        if (!getContainingStatement(j, j(s1Parent.body[i]))) {
            return false;
        }
    }

    return true;
};

codeMod.scope = 'cursor';

codeMod.title = 'Call in parallel with Promise.All()';

codeMod.description = '';

codeMod.detail = '';

module.exports = codeMod;
