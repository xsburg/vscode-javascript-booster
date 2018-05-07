"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const codeMod = (fileInfo, api, options) => {
    const j = api.jscodeshift;
    const ast = fileInfo.ast;
    const target = options.target;
    const el = target.thisOrClosest(j.JSXElement).firstNode();
    el.closingElement = null;
    el.openingElement.selfClosing = true;
    const resultText = ast.toSource();
    return resultText;
};
codeMod.canRun = (fileInfo, api, options) => {
    const j = api.jscodeshift;
    const ast = fileInfo.ast;
    const target = options.target;
    let elementNode = null;
    for (const node of target.thisAndParents()) {
        if (j.JSXAttribute.check(node)) {
            // False if over an attribute
            return false;
        }
        if (j.JSXElement.check(node)) {
            elementNode = node;
            break;
        }
    }
    return Boolean(elementNode && elementNode.closingElement && elementNode.children.length === 0);
};
codeMod.scope = 'cursor';
codeMod.title = 'Collapse empty tag';
codeMod.description = '';
codeMod.detail = '';
module.exports = codeMod;
//# sourceMappingURL=jsx-collapse-empty-tag.js.map