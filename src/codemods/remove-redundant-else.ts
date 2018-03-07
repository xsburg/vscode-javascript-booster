import { CodeModExports } from '../models/CodeMod';
import {
    FunctionDeclaration,
    Printable,
    IfStatement,
    UnaryExpression,
    Expression
} from 'ast-types';
import { Collection, JsCodeShift } from 'jscodeshift';
import { findNodeAtPosition } from '../utils';

let codeMod: CodeModExports = function(fileInfo, api, options) {
    const j = api.jscodeshift;
    const src = fileInfo.ast;
    const pos = options.selection.endPos;

    const target = findNodeAtPosition(j, src, pos);
    let node = target.nodes()[0] as IfStatement;

    node.alternate = null;

    let resultText = src.toSource();
    return resultText;
};

codeMod.canRun = function(fileInfo, api, options) {
    const j = api.jscodeshift;
    const src = fileInfo.ast;
    const pos = options.selection.endPos;
    const target = findNodeAtPosition(j, src, pos);
    const node = target.nodes()[0] as IfStatement;

    return Boolean(
        j.IfStatement.check(node) &&
            j.BlockStatement.check(node.alternate) &&
            node.alternate.body.length === 0
    );
};

codeMod.scope = 'cursor';

codeMod.title = 'Remove redundant else';

codeMod.description = '';

codeMod.detail = '';

module.exports = codeMod;
