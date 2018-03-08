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
    VariableDeclaration
} from 'ast-types';
import { Collection, JsCodeShift } from 'jscodeshift';

let codeMod: CodeModExports = function(fileInfo, api, options) {
    const j = api.jscodeshift;
    const src = fileInfo.ast;
    const pos = options.selection.endPos;
    const target = src.findNodeAtPosition(pos);
    let node = target.nodes()[0] as VariableDeclaration;

    node.kind = 'let';

    let resultText = src.toSource();
    return resultText;
};

codeMod.canRun = function(fileInfo, api, options) {
    const j = api.jscodeshift;
    const src = fileInfo.ast;
    const pos = options.selection.endPos;
    const target = src.findNodeAtPosition(pos);
    let node = target.nodes()[0];

    return j.VariableDeclaration.check(node) && node.kind === 'var';
};

codeMod.scope = 'cursor';

codeMod.title = 'Convert to let';

codeMod.description = '';

codeMod.detail = '';

module.exports = codeMod;
