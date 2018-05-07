"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const codeMod = (fileInfo, api, options) => {
    const j = api.jscodeshift;
    const ast = fileInfo.ast;
    const target = options.target;
    let path = target.firstPath();
    while (path.parent && path.parent.node.type === 'BinaryExpression') {
        path = path.parent;
    }
    const expressions = [];
    const templateElements = [];
    let lastIsString = false;
    function buildTemplateLiteral(node) {
        if (j.StringLiteral.check(node)) {
            if (lastIsString) {
                // 'a' + 'b' => 'ab'
                const value = templateElements[templateElements.length - 1].value;
                value.cooked += node.value;
                value.raw += node.value;
            }
            else {
                templateElements.push(j.templateElement({
                    cooked: node.value,
                    raw: node.value
                }, false));
                lastIsString = true;
            }
            return;
        }
        if (j.match(node, {
            type: 'BinaryExpression',
            operator: '+'
        })) {
            const parenthesized = node.extra && node.extra.parenthesized;
            if (!parenthesized) {
                // expressions in parenthesis must be ignored
                buildTemplateLiteral(node.left);
                buildTemplateLiteral(node.right);
                return;
            }
        }
        if (!lastIsString) {
            templateElements.push(j.templateElement({
                cooked: '',
                raw: ''
            }, false));
        }
        lastIsString = false;
        expressions.push(node);
    }
    buildTemplateLiteral(path.node);
    templateElements[templateElements.length - 1].tail = lastIsString;
    const templateLiteral = j.templateLiteral(templateElements, expressions);
    path.replace(templateLiteral);
    const resultText = ast.toSource();
    return resultText;
};
codeMod.canRun = (fileInfo, api, options) => {
    const j = api.jscodeshift;
    const ast = fileInfo.ast;
    const target = options.target;
    let path = target.firstPath();
    if (!path ||
        j.ImportDeclaration.check(path.parent.node) ||
        j.JSXAttribute.check(path.parent.node)) {
        return false;
    }
    if (j.StringLiteral.check(path.node)) {
        return true;
    }
    while (path.parent && path.parent.node.type === 'BinaryExpression') {
        path = path.parent;
    }
    function hasStringLiteral(node) {
        if (j.StringLiteral.check(node)) {
            return true;
        }
        return (j.match(node, { type: 'BinaryExpression', operator: '+' }) &&
            (hasStringLiteral(node.left) || hasStringLiteral(node.right)));
    }
    return hasStringLiteral(path.node);
};
codeMod.scope = 'cursor';
codeMod.title = 'Replace with template string';
codeMod.description = '';
codeMod.detail = '';
module.exports = codeMod;
//# sourceMappingURL=replace-with-template-string.js.map