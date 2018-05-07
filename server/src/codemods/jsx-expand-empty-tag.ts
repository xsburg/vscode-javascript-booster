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

    let openingNode: JSXOpeningElement | null = null;
    for (const node of target.thisAndParents()) {
        if (j.JSXAttribute.check(node)) {
            // False if over an attribute
            return false;
        }
        if (j.JSXOpeningElement.check(node)) {
            openingNode = node;
            break;
        }
    }

    return Boolean(openingNode && openingNode.selfClosing);
};

codeMod.scope = 'cursor';

codeMod.title = 'Expand empty tag';

codeMod.description = '';

codeMod.detail = '';

module.exports = codeMod;
