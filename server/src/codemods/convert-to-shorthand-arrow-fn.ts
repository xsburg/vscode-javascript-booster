import {
    ArrowFunctionExpression,
    BlockStatement,
    Expression,
    ExpressionStatement,
    FunctionDeclaration,
    IfStatement,
    Printable,
    ReturnStatement,
    UnaryExpression,
} from 'ast-types';
import { Collection, JsCodeShift } from 'jscodeshift';
import { CodeModExports } from '../codeModTypes';

const codeMod: CodeModExports = ((fileInfo, api, options) => {
    const j = api.jscodeshift;
    const ast = fileInfo.ast;
    const target = options.target;
    const node = target.firstNode<ArrowFunctionExpression>()!;

    const blockStatement = (node.body as BlockStatement).body[0];
    if (j.ReturnStatement.check(blockStatement)) {
        const returnExpr = blockStatement.argument || j.identifier('undefined');
        node.body = returnExpr;
    } else {
        const expr = (blockStatement as ExpressionStatement).expression;
        node.body = expr;
    }

    const resultText = ast.toSource();
    return resultText;
}) as CodeModExports;

codeMod.canRun = (fileInfo, api, options) => {
    const j = api.jscodeshift;
    const ast = fileInfo.ast;
    const target = options.target;
    const node = target.firstNode();

    return (
        j.ArrowFunctionExpression.check(node) &&
        j.BlockStatement.check(node.body) &&
        node.body.body.length === 1 &&
        (j.ReturnStatement.check(node.body.body[0]) ||
            j.ExpressionStatement.check(node.body.body[0]))
    );
};

codeMod.scope = 'cursor';

codeMod.title = 'Convert to shorthand arrow function';

codeMod.description = '';

codeMod.detail = '';

module.exports = codeMod;
