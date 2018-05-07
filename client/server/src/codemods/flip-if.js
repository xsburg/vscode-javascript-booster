"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const astHelpers_1 = require("../utils/astHelpers");
const codeMod = (fileInfo, api, options) => {
    const j = api.jscodeshift;
    const ast = fileInfo.ast;
    const target = options.target;
    const node = target.firstNode();
    const consequent = node.consequent;
    let alternate;
    if (node.alternate) {
        alternate = node.alternate;
    }
    else {
        alternate = j.blockStatement([j.debuggerStatement()]);
    }
    node.consequent = alternate;
    node.alternate = consequent;
    node.test = astHelpers_1.negateExpression(j, node.test);
    const resultText = ast.toSource();
    return resultText;
};
codeMod.canRun = (fileInfo, api, options) => {
    const j = api.jscodeshift;
    const ast = fileInfo.ast;
    const target = options.target;
    const node = target.firstNode();
    return j.IfStatement.check(node);
};
codeMod.scope = 'cursor';
codeMod.title = 'Flip if-else';
codeMod.description = '';
codeMod.detail = '';
module.exports = codeMod;
//# sourceMappingURL=flip-if.js.map