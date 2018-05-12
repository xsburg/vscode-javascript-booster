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
import { CodeModExports } from '../codeModTypes';

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

    let elementNode: JSXElement | null = null;
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
