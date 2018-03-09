import { CodeModExports } from '../models/CodeMod';
import {
    FunctionDeclaration,
    Printable,
    IfStatement,
    UnaryExpression,
    Expression,
    BinaryExpression,
    Node,
    AstNode,
    TemplateElement,
    StringLiteral,
    NodePath
} from 'ast-types';
import { Collection, JsCodeShift } from 'jscodeshift';

let codeMod: CodeModExports = function(fileInfo, api, options) {
    const j = api.jscodeshift;
    const src = fileInfo.ast;
    const pos = options.selection.endPos;

    let path = src.findNodeAtPosition(pos).firstPath() as NodePath<StringLiteral>;

    path.replace(j.jsxExpressionContainer(j.stringLiteral(path.node.value)));

    let resultText = src.toSource();
    return resultText;
};

codeMod.canRun = function(fileInfo, api, options) {
    const j = api.jscodeshift;
    const src = fileInfo.ast;
    const pos = options.selection.endPos;
    let path = src.findNodeAtPosition(pos).firstPath();

    return path && j.StringLiteral.check(path.node) && j.JSXAttribute.check(path.parent.node);
};

codeMod.scope = 'cursor';

codeMod.title = 'Replace with {}';

codeMod.description = '';

codeMod.detail = '';

module.exports = codeMod;
