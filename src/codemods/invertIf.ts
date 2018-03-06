import { CodeModExports } from '../models/CodeMod';
import { FunctionDeclaration, Printable, IfStatement } from 'ast-types';
import { Collection, JsCodeShift } from 'jscodeshift';
import { findNodeAtPosition } from '../utils';

let codeMod: CodeModExports = function(fileInfo, api, options) {
    const j = api.jscodeshift;
    const src = fileInfo.ast;
    const pos = options.selection.endPos;

    const target = findNodeAtPosition(j, src, pos);
    const node = target.nodes()[0] as IfStatement;

    const alternate = node.alternate || j.blockStatement([]);
    const consequent = node.consequent;

    node.consequent = alternate;
    node.alternate = consequent;

    debugger;

    let resultText = src.toSource();
    return resultText;
};

codeMod.canRun = function(fileInfo, api, options) {
    const j = api.jscodeshift;
    const src = fileInfo.ast;
    const pos = options.selection.endPos;
    const target = findNodeAtPosition(j, src, pos);
    const node = target.nodes()[0] as IfStatement;

    return j.IfStatement.check(node);
};

codeMod.scope = 'cursor';

codeMod.title = 'Flip if-else';

codeMod.description = '';

codeMod.detail = '';

module.exports = codeMod;
