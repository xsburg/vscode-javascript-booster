import {
    AstNode,
    BinaryExpression,
    Expression,
    FunctionDeclaration,
    IfStatement,
    Node,
    NodePath,
    Printable,
    StringLiteral,
    TemplateElement,
    UnaryExpression
} from 'ast-types';
import { Collection, JsCodeShift } from 'jscodeshift';
import { CodeModExports } from '../codeModTypes';

const codeMod: CodeModExports = ((fileInfo, api, options) => {
    const j = api.jscodeshift;
    const ast = fileInfo.ast;
    const target = options.target;

    const path = target.firstPath<StringLiteral>()!;

    path.replace(j.jsxExpressionContainer(j.stringLiteral(path.node.value)));

    const resultText = ast.toSource();
    return resultText;
}) as CodeModExports;

codeMod.canRun = (fileInfo, api, options) => {
    const j = api.jscodeshift;
    const ast = fileInfo.ast;
    const target = options.target;
    const path = target.firstPath();

    return Boolean(
        path && j.StringLiteral.check(path.node) && j.JSXAttribute.check(path.parent.node)
    );
};

codeMod.scope = 'cursor';

codeMod.title = 'Wrap value with {}';

codeMod.description = '';

codeMod.detail = '';

module.exports = codeMod;
