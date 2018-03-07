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
import { findNodeAtPosition } from '../utils';

let codeMod: CodeModExports = function(fileInfo, api, options) {
    const j = api.jscodeshift;
    const src = fileInfo.ast;
    const pos = options.selection.endPos;

    const target = findNodeAtPosition(j, src, pos);
    let path = target.paths()[0];

    while (path.parent && !j.VariableDeclaration.check(path.node)) {
        path = path.parent;
    }

    const node = path.node as VariableDeclaration;

    let assignments = [];
    node.declarations.forEach(d => {
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
    const target = findNodeAtPosition(j, src, pos);
    let path = target.paths()[0];

    while (path.parent && !j.VariableDeclaration.check(path.node)) {
        path = path.parent;
    }

    return (
        j.VariableDeclaration.check(path.node) &&
        path.node.kind !== 'const' &&
        path.node.declarations.some(d => Boolean(j.VariableDeclarator.check(d) && d.init))
    );
};

codeMod.scope = 'cursor';

codeMod.title = 'Split into declaration and initialization';

codeMod.description = '';

codeMod.detail = '';

module.exports = codeMod;
