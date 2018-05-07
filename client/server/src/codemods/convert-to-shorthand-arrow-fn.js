"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const codeMod = (fileInfo, api, options) => {
    const j = api.jscodeshift;
    const ast = fileInfo.ast;
    const target = options.target;
    const node = target.firstNode();
    const blockStatement = node.body.body[0];
    if (j.ReturnStatement.check(blockStatement)) {
        const returnExpr = blockStatement.argument || j.identifier('undefined');
        node.body = returnExpr;
    }
    else {
        const expr = blockStatement.expression;
        node.body = expr;
    }
    const resultText = ast.toSource();
    return resultText;
};
codeMod.canRun = (fileInfo, api, options) => {
    const j = api.jscodeshift;
    const ast = fileInfo.ast;
    const target = options.target;
    const node = target.firstNode();
    return (j.ArrowFunctionExpression.check(node) &&
        j.BlockStatement.check(node.body) &&
        node.body.body.length === 1 &&
        (j.ReturnStatement.check(node.body.body[0]) ||
            j.ExpressionStatement.check(node.body.body[0])));
};
codeMod.scope = 'cursor';
codeMod.title = 'Convert to shorthand arrow function';
codeMod.description = '';
codeMod.detail = '';
module.exports = codeMod;
//# sourceMappingURL=convert-to-shorthand-arrow-fn.js.map