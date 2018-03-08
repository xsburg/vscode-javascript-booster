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
    TemplateElement
} from 'ast-types';
import { Collection, JsCodeShift } from 'jscodeshift';

let codeMod: CodeModExports = function(fileInfo, api, options) {
    const j = api.jscodeshift;
    const src = fileInfo.ast;
    const pos = options.selection.endPos;

    let path = src.findNodeAtPosition(pos).firstPath();
    while (path.parent && path.parent.node.type === 'BinaryExpression') {
        path = path.parent;
    }

    let expressions: Expression[] = [];
    let templateElements: TemplateElement[] = [];
    let lastIsString: boolean = false;
    j.templateLiteral;
    function buildTemplateLiteral(node: Expression) {
        if (j.StringLiteral.check(node)) {
            templateElements.push(
                j.templateElement(
                    {
                        cooked: node.value,
                        raw: node.value
                    },
                    false
                )
            );
            lastIsString = true;
            return;
        }

        if (
            j.match<BinaryExpression>(node, {
                type: 'BinaryExpression',
                operator: '+'
            } as any)
        ) {
            const parenthesized = (node as any).extra && (node as any).extra.parenthesized;
            if (!parenthesized) {
                // expressions in parenthesis must be ignored
                buildTemplateLiteral(node.left);
                buildTemplateLiteral(node.right);
                return;
            }
        }

        if (!lastIsString) {
            templateElements.push(
                j.templateElement(
                    {
                        cooked: '',
                        raw: ''
                    },
                    false
                )
            );
        }
        lastIsString = false;
        expressions.push(node);
    }
    buildTemplateLiteral(path.node as Expression);

    templateElements[templateElements.length - 1].tail = lastIsString;
    const templateLiteral = j.templateLiteral(templateElements, expressions);
    path.replace(templateLiteral);

    let resultText = src.toSource();
    return resultText;
};

codeMod.canRun = function(fileInfo, api, options) {
    const j = api.jscodeshift;
    const src = fileInfo.ast;
    const pos = options.selection.endPos;
    let path = src.findNodeAtPosition(pos).firstPath();

    while (path.parent && path.parent.node.type === 'BinaryExpression') {
        path = path.parent;
    }

    function hasStringLiteral(node: AstNode) {
        if (j.StringLiteral.check(node)) {
            return true;
        }

        return (
            j.match<BinaryExpression>(node, { type: 'BinaryExpression', operator: '+' }) &&
            (hasStringLiteral(node.left) || hasStringLiteral(node.right))
        );
    }

    return hasStringLiteral(path.node);
};

codeMod.scope = 'cursor';

codeMod.title = 'Replace with template string';

codeMod.description = '';

codeMod.detail = '';

module.exports = codeMod;
