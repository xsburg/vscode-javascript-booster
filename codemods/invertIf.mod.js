module.exports = function (fileInfo, api, options) {
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
}
module.exports.name = 'Update nothing';
module.exports.description = 'Update nothing smoothly';
module.exports.detail = 'Update nothing in detail';