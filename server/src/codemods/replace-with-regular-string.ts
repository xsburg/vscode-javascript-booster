import {
    AstNode,
    BinaryExpression,
    Expression,
    FunctionDeclaration,
    IfStatement,
    Node,
    Printable,
    TemplateElement,
    TemplateLiteral,
    UnaryExpression
} from 'ast-types';
import { Collection, JsCodeShift } from 'jscodeshift';
import { CodeModExports } from '../codeModTypes';

const codeMod: CodeModExports = ((fileInfo, api, options) => {
    const j = api.jscodeshift;
    const ast = fileInfo.ast;
    const target = options.target;

    const path = target.thisOrClosest(j.TemplateLiteral).firstPath()!;
    const literal = path.node as TemplateLiteral;

    const expressions: Expression[] = [];
    const firstStrValue = literal.quasis[0].value.cooked;
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

    if (expressions.length === 0) {
        expressions.push(j.stringLiteral(firstStrValue));
    }

    function combineExpressions(rightIndex: number): Expression {
        if (rightIndex === 0) {
            return expressions[0];
        }
        return j.binaryExpression('+', combineExpressions(rightIndex - 1), expressions[rightIndex]);
    }

    const combinedExpr = combineExpressions(expressions.length - 1);
    path.replace(combinedExpr);

    const resultText = ast.toSource();
    return resultText;
}) as CodeModExports;

codeMod.canRun = (fileInfo, api, options) => {
    const j = api.jscodeshift;
    const ast = fileInfo.ast;
    const target = options.target;
    const path = target.thisOrClosest(j.TemplateLiteral).firstPath();

    return Boolean(path);
};

codeMod.scope = 'cursor';

codeMod.title = 'Replace with regular string';

codeMod.description = '';

codeMod.detail = '';

module.exports = codeMod;
