import {
    Expression,
    FunctionDeclaration,
    IfStatement,
    JSXElement,
    JSXOpeningElement,
    Printable,
    UnaryExpression
} from 'ast-types';
import { Collection, JsCodeShift } from 'jscodeshift';
import { CodeModExports } from '../models/CodeMod';

const codeMod: CodeModExports = (fileInfo, api, options) => {
    const j = api.jscodeshift;
    const ast = fileInfo.ast;
    const target = options.target;

    const path = target.thisOrClosest(j.JSXOpeningElement).firstPath()!;

    const jsxElement = path.parent.node as JSXElement;
    jsxElement.closingElement = j.jsxClosingElement(path.node.name);
    path.node.selfClosing = false;

    const resultText = ast.toSource();
    return resultText;
};

codeMod.canRun = (fileInfo, api, options) => {
    const j = api.jscodeshift;
    const ast = fileInfo.ast;
    const target = options.target;

    const openingTag = target.thisOrClosest(j.JSXOpeningElement).firstNode();
    if (!openingTag || !openingTag.selfClosing) {
        return false;
    }

    const notAnAttribute = target.thisOrClosest(j.JSXAttribute).length === 0;
    return notAnAttribute;
};

codeMod.scope = 'cursor';

codeMod.title = 'Expand empty tag';

codeMod.description = '';

codeMod.detail = '';

module.exports = codeMod;
