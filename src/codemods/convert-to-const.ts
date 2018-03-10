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
    const ast = fileInfo.ast;
    const target = options.target;
    let node = target.firstNode<VariableDeclaration>();

    node.kind = 'const';

    let resultText = ast.toSource();
    return resultText;
};

codeMod.canRun = function(fileInfo, api, options) {
    const j = api.jscodeshift;
    const ast = fileInfo.ast;
    const target = options.target;
    let node = target.firstNode();

    return j.VariableDeclaration.check(node) && node.kind === 'var';
};

codeMod.scope = 'cursor';

codeMod.title = 'Convert to const';

codeMod.description = '';

codeMod.detail = '';

module.exports = codeMod;
