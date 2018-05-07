"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const codeMod = (fileInfo, api, options) => {
    const j = api.jscodeshift;
    const ast = fileInfo.ast;
    const target = options.target;
    const path = target.firstPath();
    path.replace(j.jsxExpressionContainer(j.stringLiteral(path.node.value)));
    const resultText = ast.toSource();
    return resultText;
};
codeMod.canRun = (fileInfo, api, options) => {
    const j = api.jscodeshift;
    const ast = fileInfo.ast;
    const target = options.target;
    const path = target.firstPath();
    return Boolean(path && j.StringLiteral.check(path.node) && j.JSXAttribute.check(path.parent.node));
};
codeMod.scope = 'cursor';
codeMod.title = 'Wrap value with {}';
codeMod.description = '';
codeMod.detail = '';
module.exports = codeMod;
//# sourceMappingURL=jsx-replace-with-curly-braces.js.map