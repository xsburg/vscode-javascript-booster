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

    const raw = ((node as any).extra as any).raw as string;
    const quoteChar = raw[0];
    const offset = options.selection.active - node.start;

    // Identifiers are used as we want to preserve the original escape characters
    // and find the cursor's position at the same time.

    let leftValue = raw.substring(0, offset);
    let rightValue = raw.substring(offset);
    if (leftValue.endsWith('\\')) {
        if (rightValue.startsWith('\n')) {
            // Multiline literal with slash escaping new line. We remove both escapes.
            leftValue = leftValue.substring(0, leftValue.length - 1);
            rightValue = rightValue.substring(1);
        } else {
            // Move the escape character into the right pair (so the strings keep being valid)
            leftValue = leftValue.substring(0, leftValue.length - 1);
            rightValue = '\\' + rightValue;
        }
    }

    const index = leftValue.lastIndexOf('\\');

    const leftNode = j.identifier(leftValue + quoteChar);
    const rightNode = j.identifier(quoteChar + rightValue);

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
