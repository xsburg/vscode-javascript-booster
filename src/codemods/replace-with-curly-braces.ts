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
    StringLiteral,
    NodePath
} from 'ast-types';
import { Collection, JsCodeShift } from 'jscodeshift';

let codeMod: CodeModExports = function(fileInfo, api, options) {
    const j = api.jscodeshift;
    const ast = fileInfo.ast;
    const target = options.target;

    let path = target.firstPath<StringLiteral>();

    path.replace(j.jsxExpressionContainer(j.stringLiteral(path.node.value)));

    let resultText = ast.toSource();
    return resultText;
};

codeMod.canRun = function(fileInfo, api, options) {
    const j = api.jscodeshift;
    const ast = fileInfo.ast;
    const target = options.target;
    let path = target.firstPath();

    return path && j.StringLiteral.check(path.node) && j.JSXAttribute.check(path.parent.node);
};

codeMod.scope = 'cursor';

codeMod.title = 'Replace with {}';

codeMod.description = '';

codeMod.detail = '';

module.exports = codeMod;
