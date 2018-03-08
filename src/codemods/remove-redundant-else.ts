import { CodeModExports } from '../models/CodeMod';
import {
    FunctionDeclaration,
    Printable,
    IfStatement,
    UnaryExpression,
    Expression
} from 'ast-types';
import { Collection, JsCodeShift } from 'jscodeshift';

let codeMod: CodeModExports = function(fileInfo, api, options) {
    const j = api.jscodeshift;
    const src = fileInfo.ast;
    const pos = options.selection.endPos;

    const node = src.findNodeAtPosition(pos).firstNode()! as IfStatement;
    node.alternate = null;

    let resultText = src.toSource();
    return resultText;
};

codeMod.canRun = function(fileInfo, api, options) {
    const j = api.jscodeshift;
    const src = fileInfo.ast;
    const pos = options.selection.endPos;
    const node = src.findNodeAtPosition(pos).firstNode();

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
