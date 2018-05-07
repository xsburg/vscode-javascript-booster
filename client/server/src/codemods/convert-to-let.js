"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const codeMod = (fileInfo, api, options) => {
    const j = api.jscodeshift;
    const ast = fileInfo.ast;
    const target = options.target;
    const node = target.firstNode();
    node.kind = 'let';
    const resultText = ast.toSource();
    return resultText;
};
codeMod.canRun = (fileInfo, api, options) => {
    const j = api.jscodeshift;
    const ast = fileInfo.ast;
    const target = options.target;
    const node = target.firstNode();
    return j.VariableDeclaration.check(node) && (node.kind === 'var' || node.kind === 'const');
};
codeMod.scope = 'cursor';
codeMod.title = 'Convert to let';
codeMod.description = '';
codeMod.detail = '';
module.exports = codeMod;
//# sourceMappingURL=convert-to-let.js.map