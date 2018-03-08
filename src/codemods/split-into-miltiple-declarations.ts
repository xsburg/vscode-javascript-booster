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

    const path = src
        .findNodeAtPosition(pos)
        .thisOrClosest(j.VariableDeclaration)
        .firstPath()!;
    const node = path.node;

    const declarations = node.declarations
        .map(d => j.variableDeclaration(node.kind, [d]))
        .reverse();
    declarations.forEach(d => {
        path.insertAfter(d);
    });
    path.prune();

    let resultText = src.toSource();
    return resultText;
};

codeMod.canRun = function(fileInfo, api, options) {
    const j = api.jscodeshift;
    const src = fileInfo.ast;
    const pos = options.selection.endPos;
    const path = src
        .findNodeAtPosition(pos)
        .thisOrClosest(j.VariableDeclaration)
        .firstPath();
    return path && path.node.declarations.length > 1;
};

codeMod.scope = 'cursor';

codeMod.title = 'Split into multiple declarations';

codeMod.description = '';

codeMod.detail = '';

module.exports = codeMod;
