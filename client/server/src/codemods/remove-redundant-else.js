"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const codeMod = (fileInfo, api, options) => {
    const j = api.jscodeshift;
    const ast = fileInfo.ast;
    const target = options.target;
    const node = target.firstNode();
    node.alternate = null;
    const resultText = ast.toSource();
    return resultText;
};
codeMod.canRun = (fileInfo, api, options) => {
    const j = api.jscodeshift;
    const ast = fileInfo.ast;
    const target = options.target;
    const node = target.firstNode();
    return Boolean(j.IfStatement.check(node) &&
        j.BlockStatement.check(node.alternate) &&
        node.alternate.body.length === 0);
};
codeMod.scope = 'cursor';
codeMod.title = 'Remove redundant else';
codeMod.description = '';
codeMod.detail = '';
module.exports = codeMod;
//# sourceMappingURL=remove-redundant-else.js.map