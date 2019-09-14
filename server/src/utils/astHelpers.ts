import {
    AstNode,
    Expression,
    Node,
    NodePath,
    Statement,
    StringLiteral,
    UnaryExpression
} from 'ast-types';
import { Collection, JsCodeShift } from 'jscodeshift';

export function negateExpression(j: JsCodeShift, expr: Expression) {
    // 1. !a => a
    if (j.match<UnaryExpression>(expr, { type: 'UnaryExpression', operator: '!' })) {
        return expr.argument;
    }

    // 2. invert binary operators
    const operatorMap: {
        [operator: string]: string | undefined;
    } = {
        '<': '>=',
        '>': '<=',
        '>=': '<',
        '<=': '>',
        '!=': '==',
        '==': '!=',
        '!==': '===',
        '===': '!=='
    };
    if (j.BinaryExpression.check(expr) && operatorMap[expr.operator]) {
        expr.operator = operatorMap[expr.operator];
        return expr;
    }

    // Fallback: a => !a
    return j.unaryExpression('!', expr);
}

/**
 * Checks if the asked node is a StringLiteral AND also checks
 * if it's a proper string inside a JS expression, not inside imports, TS string Enums etc.
 */
export function isStringExpression(
    j: JsCodeShift,
    path: NodePath<AstNode> | null
): path is NodePath<StringLiteral> {
    if (!path || !j.StringLiteral.check(path.node)) {
        return false;
    }

    const parentNode = path.parent && path.parent.node;
    if (
        j.ImportDeclaration.check(parentNode) ||
        j.JSXAttribute.check(parentNode) ||
        j.TSEnumMember.check(parentNode) ||
        ((j.ObjectProperty.check(parentNode) || j.ObjectMethod.check(parentNode)) &&
            parentNode.key === path.node)
    ) {
        return false;
    }

    return true;
}

/**
 * When node is one of these: `expression;`, `{ expression; }`, `{ { expression; } }` etc.
 *
 * Returns `expression`.
 *
 * Otherwise, `null`.
 *
 * Useful e.g. when you want to get the content of `if` consequent branch etc.
 * @param j codeshift
 * @param n node to check
 */
export function getSingleStatement(j: JsCodeShift, n: Node | null): Statement | null {
    if (j.BlockStatement.check(n) && n.body.length === 1) {
        return getSingleStatement(j, n.body[0]);
    }
    if (j.Statement.check(n)) {
        return n;
    }
    return null;
}

/**
 * When given the following example:
 * ```
 * {
 *     //...
 *     thisStatement;
 *     nextStatement;
 *     //...
 * }
 * ```
 * Returns the `nextStatement` or `null` if not inside a block, target is the last statement etc.
 * @param j codeshift
 * @param p path to work with
 */
export function getNextStatementInBlock(j: JsCodeShift, p: NodePath<Statement>): Statement | null {
    if (!p.parent || !j.BlockStatement.check(p.parent.node)) {
        return null;
    }
    const blockBody = p.parent.node.body;
    const index = blockBody.indexOf(p.node);
    if (index !== -1 && index + 1 < blockBody.length) {
        return blockBody[index + 1];
    }
    return null;
}

export function getParentBlockStatament(j: JsCodeShift, p: NodePath<Statement>): Statement | null {
    if (!p.parent || !j.BlockStatement.check(p.parent.node)) {
        return null;
    }
    const blockBody = p.parent.node.body;
    const index = blockBody.indexOf(p.node);
    if (index !== -1 && index + 1 < blockBody.length) {
        return blockBody[index + 1];
    }
    return null;
}
