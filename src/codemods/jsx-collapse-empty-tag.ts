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

    const el = target.thisOrClosest(j.JSXElement).firstNode()!;
    el.closingElement = null;
    el.openingElement.selfClosing = true;

    const resultText = ast.toSource();
    return resultText;
};

codeMod.canRun = (fileInfo, api, options) => {
    const j = api.jscodeshift;
    const ast = fileInfo.ast;
    const target = options.target;

    const el = target.thisOrClosest(j.JSXElement).firstNode();
    if (!el || !el.closingElement) {
        return false;
    }

    const notAnAttribute = target.thisOrClosest(j.JSXAttribute).length === 0;
    const empty = el.children.length === 0;
    return notAnAttribute && empty;
};

codeMod.scope = 'cursor';

codeMod.title = 'Collapse empty tag';

codeMod.description = '';

codeMod.detail = '';

module.exports = codeMod;
