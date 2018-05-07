"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const codeMod = (fileInfo, api, options) => {
    const j = api.jscodeshift;
    const ast = fileInfo.ast;
    const target = options.target;
    const $jsxExprContainer = target.thisOrClosest(j.JSXExpressionContainer, {
        expression: { type: 'StringLiteral' }
    });
    const stringLiteral = $jsxExprContainer.firstPath().node
        .expression;
    $jsxExprContainer.replaceWith(j.stringLiteral(stringLiteral.value));
    const resultText = ast.toSource();
    return resultText;
};
codeMod.canRun = (fileInfo, api, options) => {
    const j = api.jscodeshift;
    const ast = fileInfo.ast;
    const target = options.target;
    const $jsxExprContainer = target.thisOrClosest(j.JSXExpressionContainer, {
        expression: { type: 'StringLiteral' }
    });
    if ($jsxExprContainer.length === 0) {
        return false;
    }
    return Boolean(j.JSXAttribute.check($jsxExprContainer.firstPath().parent.node));
};
codeMod.scope = 'cursor';
codeMod.title = 'Remove braces';
codeMod.description = '';
codeMod.detail = '';
module.exports = codeMod;
//# sourceMappingURL=jsx-remove-curly-braces.js.map