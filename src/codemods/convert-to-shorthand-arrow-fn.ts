import {
    ArrowFunctionExpression,
    BlockStatement,
    Expression,
    FunctionDeclaration,
    IfStatement,
    Printable,
    ReturnStatement,
    UnaryExpression
} from 'ast-types';
import { Collection, JsCodeShift } from 'jscodeshift';
import { CodeModExports } from '../models/CodeMod';

const codeMod: CodeModExports = (fileInfo, api, options) => {
    const j = api.jscodeshift;
    const ast = fileInfo.ast;
    const target = options.target;
    const node = target.firstNode<ArrowFunctionExpression>();

    const returnStatement = (node.body as BlockStatement).body[0] as ReturnStatement;
    const returnExpr = returnStatement.argument;
    node.body = returnExpr;

    const resultText = ast.toSource();
    return resultText;
};

codeMod.canRun = (fileInfo, api, options) => {
    const j = api.jscodeshift;
    const ast = fileInfo.ast;
    const target = options.target;
    const node = target.firstNode();

    return (
        j.ArrowFunctionExpression.check(node) &&
        j.BlockStatement.check(node.body) &&
        node.body.body.length === 1 &&
        j.ReturnStatement.check(node.body.body[0])
    );
};

codeMod.scope = 'cursor';

codeMod.title = 'Convert to shorthand arrow function';

codeMod.description = '';

codeMod.detail = '';

module.exports = codeMod;
