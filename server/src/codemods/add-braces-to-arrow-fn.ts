import {
    ArrowFunctionExpression,
    Expression,
    FunctionDeclaration,
    IfStatement,
    Printable,
    UnaryExpression,
} from 'ast-types';
import { Collection, JsCodeShift } from 'jscodeshift';
import { CodeModExports } from '../codeModTypes';

const codeMod: CodeModExports = ((fileInfo, api, options) => {
    const j = api.jscodeshift;
    const ast = fileInfo.ast;
    const target = options.target;
    const node = target.firstNode<ArrowFunctionExpression>()!;

    const expr = node.body;
    node.body = j.blockStatement([j.returnStatement(expr)]);

    const resultText = ast.toSource();
    return resultText;
}) as CodeModExports;

codeMod.canRun = (fileInfo, api, options) => {
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
