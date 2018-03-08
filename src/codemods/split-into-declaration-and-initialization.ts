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
    VariableDeclaration,
    VariableDeclarator
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

    let assignments = [];
    path.node.declarations.forEach(d => {
        if (j.VariableDeclarator.check(d) && d.init) {
            assignments.push(j.expressionStatement(j.assignmentExpression('=', d.id, d.init)));
            d.init = null;
        }
    });

    assignments.reverse().forEach(a => {
        path.insertAfter(a);
    });

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

    return (
        path &&
        path.node.kind !== 'const' &&
        path.node.declarations.some(d => Boolean(j.VariableDeclarator.check(d) && d.init))
    );
};

codeMod.scope = 'cursor';

codeMod.title = 'Split into declaration and initialization';

codeMod.description = '';

codeMod.detail = '';

module.exports = codeMod;
