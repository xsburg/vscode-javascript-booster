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

let codeMod: CodeModExports = function(fileInfo, api, options) {
    const j = api.jscodeshift;
    const ast = fileInfo.ast;
    const target = options.target;
    const node = target.firstNode<ArrowFunctionExpression>();

    const expr = node.body;
    node.body = j.blockStatement([j.returnStatement(expr)]);

    let resultText = ast.toSource();
    return resultText;
};

codeMod.canRun = function(fileInfo, api, options) {
    const j = api.jscodeshift;
    const target = options.target;
    const node = target.firstNode();

    return j.ArrowFunctionExpression.check(node) && j.Expression.check(node.body);
};

codeMod.scope = 'cursor';

codeMod.title = 'Add braces to arrow function statement';

codeMod.description = '';

codeMod.detail = '';

module.exports = codeMod;
