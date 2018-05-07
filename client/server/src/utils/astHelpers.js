"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function negateExpression(j, expr) {
    // 1. !a => a
    if (j.match(expr, { type: 'UnaryExpression', operator: '!' })) {
        return expr.argument;
    }
    // 2. invert binary operators
    const operatorMap = {
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
exports.negateExpression = negateExpression;
//# sourceMappingURL=astHelpers.js.map