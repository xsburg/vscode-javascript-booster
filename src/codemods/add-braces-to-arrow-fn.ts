import { CodeModExports } from '../models/CodeMod';
import {
    FunctionDeclaration,
    Printable,
    IfStatement,
    UnaryExpression,
    Expression,
    ArrowFunctionExpression
} from 'ast-types';
import { Collection, JsCodeShift } from 'jscodeshift';
import { findNodeAtPosition } from '../utils';

let codeMod: CodeModExports = function(fileInfo, api, options) {
    const j = api.jscodeshift;
    const src = fileInfo.ast;
    const pos = options.selection.endPos;

    const target = findNodeAtPosition(j, src, pos);
    let node = target.nodes()[0] as ArrowFunctionExpression;

    const expr = node.body;
    node.body = j.blockStatement([j.returnStatement(expr)]);

    let resultText = src.toSource();
    return resultText;
};

codeMod.canRun = function(fileInfo, api, options) {
    const j = api.jscodeshift;
    const src = fileInfo.ast;
    const pos = options.selection.endPos;
    const target = findNodeAtPosition(j, src, pos);
    const node = target.nodes()[0] as IfStatement;

    return j.ArrowFunctionExpression.check(node) && j.Expression.check(node.body);
};

codeMod.scope = 'cursor';

codeMod.title = 'Add braces to arrow function statement';

codeMod.description = '';

codeMod.detail = '';

module.exports = codeMod;
