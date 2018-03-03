import { CodeModExports } from "../models/CodeMod";

let codeMod: CodeModExports = function (fileInfo, api, options) {
    const j = api.jscodeshift;
    const text = fileInfo.source;
    const src = j(text);
    let result = src.find(j.FunctionDeclaration);
    if (result.length > 0) {
        result.nodes()[0].id.name = 'bar';
    }

    if (src === text) {
        return null;
    }

    let resultText = src.toSource();
    return resultText;
};
codeMod.canRun = function (fileInfo, api, options) {
    return true;
}
codeMod.name = 'Add magic statements';
codeMod.description = 'No harm intended';
codeMod.detail = 'The statements added are scattered evenly throughout the code';

module.exports = codeMod;
