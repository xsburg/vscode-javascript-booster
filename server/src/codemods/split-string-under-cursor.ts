import {
    AstNode,
    BinaryExpression,
    Expression,
    FunctionDeclaration,
    IfStatement,
    Node,
    Printable,
    StringLiteral,
    TemplateElement,
    UnaryExpression,
    VariableDeclaration
} from 'ast-types';
import { Collection, JsCodeShift } from 'jscodeshift';
import { CodeModExports } from '../codeModTypes';

const codeMod: CodeModExports = (fileInfo, api, options) => {
    const j = api.jscodeshift;
    const ast = fileInfo.ast;
    const target = options.target;

    const path = target.firstPath<StringLiteral>()!;
    const node = path.node;

    const offset = options.selection.active - (node.start + 1); // Take opening quote into account
    const value1 = node.value.substring(0, offset);
    const value2 = node.value.substring(offset);

    const replacement = j.binaryExpression('+', j.stringLiteral(value1), j.stringLiteral(value2));
    path.replace(replacement);

    const resultText = ast.toSource();
    return resultText;
};

codeMod.canRun = (fileInfo, api, options) => {
    const j = api.jscodeshift;
    const ast = fileInfo.ast;
    const target = options.target;
    const node = target.firstNode();

    return Boolean(node && j.StringLiteral.check(node));
};

codeMod.scope = 'cursor';

codeMod.title = 'Split string under cursor';

codeMod.description = '';

codeMod.detail = '';

module.exports = codeMod;
