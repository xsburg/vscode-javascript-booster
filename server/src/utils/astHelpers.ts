import { AstNode, Expression, NodePath, StringLiteral, UnaryExpression } from 'ast-types';
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
