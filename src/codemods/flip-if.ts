import { CodeModExports } from '../models/CodeMod';
import {
    FunctionDeclaration,
    Printable,
    IfStatement,
    UnaryExpression,
    Expression
} from 'ast-types';
import { Collection, JsCodeShift } from 'jscodeshift';

function negateExpression(j: JsCodeShift, expr: Expression) {
    // 1. !a => a
    if (j.match<UnaryExpression>(expr, { type: 'UnaryExpression', operator: '!' })) {
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

let codeMod: CodeModExports = function(fileInfo, api, options) {
    const j = api.jscodeshift;
    const src = fileInfo.ast;
    const pos = options.selection.endPos;

    const target = src.findNodeAtPosition(pos);
    let node = target.nodes()[0] as IfStatement;

    const consequent = node.consequent;
    let alternate;
    if (node.alternate) {
        alternate = node.alternate;
    } else {
        alternate = j.blockStatement([j.debuggerStatement()]);
    }

    node.consequent = alternate;
    node.alternate = consequent;
    node.test = negateExpression(j, node.test);

    let resultText = src.toSource();
    return resultText;
};

codeMod.canRun = function(fileInfo, api, options) {
    const j = api.jscodeshift;
    const src = fileInfo.ast;
    const pos = options.selection.endPos;
    const target = src.findNodeAtPosition(pos);
    const node = target.nodes()[0] as IfStatement;

    return j.IfStatement.check(node);
};

codeMod.scope = 'cursor';

codeMod.title = 'Flip if-else';

codeMod.description = '';

codeMod.detail = '';

module.exports = codeMod;
