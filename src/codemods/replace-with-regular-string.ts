import { CodeModExports } from '../models/CodeMod';
import {
    FunctionDeclaration,
    Printable,
    IfStatement,
    UnaryExpression,
    Expression,
    BinaryExpression,
    Node,
    AstNode,
    TemplateElement,
    TemplateLiteral
} from 'ast-types';
import { Collection, JsCodeShift } from 'jscodeshift';

let codeMod: CodeModExports = function(fileInfo, api, options) {
    const j = api.jscodeshift;
    const src = fileInfo.ast;
    const pos = options.selection.endPos;

    let path = src
        .findNodeAtPosition(pos)
        .thisOrClosest(j.TemplateLiteral)
        .firstPath()!;
    const literal = path.node as TemplateLiteral;

    let expressions: Expression[] = [];
    let firstStrValue = literal.quasis[0].value.cooked;
    if (firstStrValue) {
        expressions.push(j.stringLiteral(firstStrValue));
    }
    for (let i = 0; i < literal.expressions.length; i++) {
        const expr = literal.expressions[i];
        expressions.push(expr);
        const strValue = literal.quasis[i + 1].value.cooked;
        if (strValue) {
            expressions.push(j.stringLiteral(strValue));
        }
    }

    function combineExpressions(rightIndex: number) {
        if (rightIndex === 0) {
            return expressions[0];
        }
        return j.binaryExpression('+', combineExpressions(rightIndex - 1), expressions[rightIndex]);
    }
    const combinedExpr = combineExpressions(expressions.length - 1);
    path.replace(combinedExpr);

    let resultText = src.toSource();
    return resultText;
};

codeMod.canRun = function(fileInfo, api, options) {
    const j = api.jscodeshift;
    const src = fileInfo.ast;
    const pos = options.selection.endPos;
    let path = src
        .findNodeAtPosition(pos)
        .thisOrClosest(j.TemplateLiteral)
        .firstPath();

    return Boolean(path);
};

codeMod.scope = 'cursor';

codeMod.title = 'Replace with regular string';

codeMod.description = '';

codeMod.detail = '';

module.exports = codeMod;
