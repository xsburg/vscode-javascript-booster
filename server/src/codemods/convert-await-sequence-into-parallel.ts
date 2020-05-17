import {
    AssignmentExpression,
    AstNode,
    AwaitExpression,
    BlockStatement,
    Expression,
    ExpressionStatement,
    Pattern,
    Statement,
    VariableDeclaration,
    VariableDeclarator,
} from 'ast-types';
import { Collection, JsCodeShift } from 'jscodeshift';

import { CodeModExports } from '../codeModTypes';

function isExpressionStatement(j: JsCodeShift, s: Collection<Statement>) {
    return j.match<ExpressionStatement>(s, {
        type: 'ExpressionStatement',
        expression: {
            type: 'AwaitExpression',
        } as AssignmentExpression,
    });
}

function isAssignmentStatement(j: JsCodeShift, s: Collection<Statement>) {
    return j.match<ExpressionStatement>(s, {
        type: 'ExpressionStatement',
        expression: {
            type: 'AssignmentExpression',
            right: {
                type: 'AwaitExpression',
            },
        } as AssignmentExpression,
    });
}

function isVariableDeclaration(j: JsCodeShift, s: Collection<Statement>) {
    return (
        j.match<VariableDeclaration>(s, {
            type: 'VariableDeclaration',
            declarations: [
                {
                    type: 'VariableDeclarator',
                    init: {
                        type: 'AwaitExpression',
                    },
                } as VariableDeclarator,
            ],
        }) && (s.firstNode() as VariableDeclaration).declarations.length === 1
    );
}

const codeMod: CodeModExports = ((fileInfo, api, options) => {
    const j = api.jscodeshift;
    const ast = fileInfo.ast;

    // Collect all await statements
    let s1 = getContainingStatement(j, options.anchorTarget)!;
    let s2 = getContainingStatement(j, options.target)!;
    const parentBlock = s1.parents()[0] as BlockStatement;
    let from = parentBlock.body.indexOf(s1.firstNode()!);
    let to = parentBlock.body.indexOf(s2.firstNode()!);
    if (from > to) {
        [from, to] = [to, from];
        [s2, s1] = [s1, s2];
    }
    let statements = [s1];
    for (let i = from + 1; i < to; i++) {
        statements.push(getContainingStatement(j, j(parentBlock.body[i]))!);
    }
    statements.push(s2);

    // Extract necessary data from the old code
    let needsVarDeclaration = false;
    let needsAssignment = false;
    let dataList: Array<{
        targetVar: Pattern | null;
        awaitArgument: Expression;
    }> = [];
    statements.forEach((s) => {
        const node = s.firstNode();
        if (isExpressionStatement(j, s)) {
            dataList.push({
                targetVar: null,
                awaitArgument: ((node as ExpressionStatement).expression as AwaitExpression)
                    .argument!,
            });
        } else if (isVariableDeclaration(j, s)) {
            needsVarDeclaration = true;
            const declarator = (node as VariableDeclaration).declarations[0] as VariableDeclarator;
            dataList.push({
                targetVar: declarator.id,
                awaitArgument: (declarator.init as AwaitExpression).argument!,
            });
        } else if (isAssignmentStatement(j, s)) {
            needsAssignment = true;
            const assignmentExpr = (node as ExpressionStatement).expression as AssignmentExpression;
            dataList.push({
                targetVar: assignmentExpr.left,
                awaitArgument: (assignmentExpr.right as AwaitExpression).argument!,
            });
        } else {
            throw new Error('Not supported');
        }
    });

    // Trailing nulls are truncated, e.g.: [,,result,,] => [,,result]
    let varList = dataList.map((x) => x.targetVar);
    while (varList.length > 0 && !varList[varList.length - 1]) {
        varList.pop();
    }

    // Generating new code
    const awaitExpr = j.awaitExpression(
        j.callExpression(j.memberExpression(j.identifier('Promise'), j.identifier('all')), [
            j.arrayExpression(dataList.map((x) => x.awaitArgument)),
        ])
    );

    let newStatement;
    if (needsVarDeclaration) {
        const targetArray = j.arrayPattern(varList);
        newStatement = j.variableDeclaration('let', [j.variableDeclarator(targetArray, awaitExpr)]);
    } else if (needsAssignment) {
        const targetArray = j.arrayPattern(varList);
        newStatement = j.expressionStatement(j.assignmentExpression('=', targetArray, awaitExpr));
    } else {
        newStatement = j.expressionStatement(awaitExpr);
    }

    parentBlock.body.splice(from, to - from + 1, newStatement);
    const resultText = ast.toSource();
    return resultText;
}) as CodeModExports;

function getContainingStatement(
    j: JsCodeShift,
    c: Collection<AstNode>
): Collection<Statement> | null {
    const s = c.thisOrClosest(j.Statement);
    if (isExpressionStatement(j, s)) {
        // Example: 'await foo();'
        return s;
    }
    if (isAssignmentStatement(j, s)) {
        // Example: 'result = await foo();'
        return s;
    }
    if (isVariableDeclaration(j, s)) {
        // Example: 'let result = await foo();'
        return s;
    }
    return null;
}

codeMod.canRun = (fileInfo, api, options) => {
    const j = api.jscodeshift;
    const path = options.target.firstPath();

    if (!path) {
        return false;
    }

    if (options.selection.anchor === options.selection.active) {
        // Works on range selections only
        return false;
    }

    const s1 = getContainingStatement(j, options.anchorTarget);
    if (!s1) {
        return false;
    }

    const s2 = getContainingStatement(j, options.target);
    if (!s2) {
        return false;
    }

    const s1Parent = s1.parents()[0];
    const s2Parent = s2.parents()[0];
    if (!j.BlockStatement.check(s1Parent) || s1Parent !== s2Parent) {
        // Block statement mismatch
        return false;
    }

    let from = s1Parent.body.indexOf(s1.firstNode()!);
    let to = s1Parent.body.indexOf(s2.firstNode()!);
    if (from > to) {
        to = from + to;
        from = to - from;
        to = to - from;
    }
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
