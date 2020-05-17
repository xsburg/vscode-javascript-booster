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
    UnaryExpression,
    VariableDeclaration,
} from 'ast-types';
import { Collection, JsCodeShift } from 'jscodeshift';

import { CodeModExports } from '../codeModTypes';
import * as astHelpers from '../utils/astHelpers';
import { extractSelectionAnchor, SELECTION_ANCHOR } from '../utils/extractSelectionAnchor';

const codeMod: CodeModExports = ((fileInfo, api, options) => {
    const j = api.jscodeshift;
    const ast = fileInfo.ast;
    const target = options.target;

    const path = target.firstPath<StringLiteral>()!;
    const node = path.node;

    const raw = ((node as any).extra as any).raw as string;
    const quoteChar = raw[0];
    const offset = options.selection.active - node.start;

    // Identifiers are used as we want to preserve the original escape characters
    // and find the cursor's position at the same time.

    let leftValue = raw.substring(0, offset);
    let rightValue = raw.substring(offset);
    if (leftValue.endsWith('\\')) {
        const m = rightValue.match(/^[\r\n]+/);
        if (m) {
            // Multiline literal with slash escaping new line. We remove both escapes.
            leftValue = leftValue.substring(0, leftValue.length - 1);
            rightValue = rightValue.substring(m[0].length);
        } else {
            // Move the escape character into the right pair (so the strings keep being valid)
            leftValue = leftValue.substring(0, leftValue.length - 1);
            rightValue = '\\' + rightValue;
        }
    }

    const leftNode = j.identifier(leftValue + quoteChar);
    const rightNode = j.identifier(SELECTION_ANCHOR + quoteChar + rightValue);

    let replacementTarget = path as NodePath<AstNode>;
    while (
        replacementTarget.parent &&
        j.BinaryExpression.check(replacementTarget.parent.node) &&
        replacementTarget.parent.node.operator === '+' &&
        replacementTarget.parent.node.right === replacementTarget.node
    ) {
        replacementTarget = replacementTarget.parent;
    }

    if (replacementTarget === path) {
        // literal, no wrapping binary expressions.
        // replacement: 'foobar' => 'foo' + 'bar'
        path.replace(j.binaryExpression('+', leftNode, rightNode));
    } else {
        // wrapping binary expressions where we are in the right operand.
        // replacement: 'extra' + 'foobar' => ('extra' + 'foo') + 'bar'
        (path.parent.node as BinaryExpression).right = leftNode;
        replacementTarget.replace(
            j.binaryExpression('+', replacementTarget.node as Expression, rightNode)
        );
    }

    return extractSelectionAnchor(ast.toSource());
}) as CodeModExports;

codeMod.canRun = (fileInfo, api, options) => {
    const j = api.jscodeshift;
    const ast = fileInfo.ast;
    const path = options.target.firstPath();

    if (!path || !astHelpers.isStringExpression(j, path)) {
        return false;
    }

    // can only trigger inside quotes
    return options.selection.active > path.node.start && options.selection.active < path.node.end;
};

codeMod.scope = 'cursor';

codeMod.title = 'Split string under cursor';

codeMod.description = '';

codeMod.detail = '';

module.exports = codeMod;
