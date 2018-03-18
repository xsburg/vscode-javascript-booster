import { Expression, UnaryExpression } from 'ast-types';
import { JsCodeShift } from 'jscodeshift';

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
