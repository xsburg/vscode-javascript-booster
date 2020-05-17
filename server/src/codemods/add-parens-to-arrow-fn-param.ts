import {
    ArrowFunctionExpression,
    Expression,
    FunctionDeclaration,
    Identifier,
    IfStatement,
    Printable,
    UnaryExpression,
} from 'ast-types';
import { Collection, JsCodeShift } from 'jscodeshift';

import { CodeModExports } from '../codeModTypes';
import { extractSelectionAnchor, SELECTION_ANCHOR } from '../utils/extractSelectionAnchor';

const codeMod: CodeModExports = ((fileInfo, api, options) => {
    const j = api.jscodeshift;
    const ast = fileInfo.ast;
    const target = options.target;
    const node = target.thisOrClosest(j.ArrowFunctionExpression).firstNode()!;

    // Identifier is updated explicitly as it is the only way to affect formatting
    const param = node.params[0] as Identifier;
    param.name = `(${param.name}${SELECTION_ANCHOR})`;

    return extractSelectionAnchor(ast.toSource());
}) as CodeModExports;

codeMod.canRun = (fileInfo, api, options) => {
    const j = api.jscodeshift;
    const target = options.target;

    // 1. Find parent arrow expression and ensure that target is not inside its body
    let arrowExpr: ArrowFunctionExpression | null = null;
    let path = target.firstPath();
    while (path) {
        if (j.ArrowFunctionExpression.check(path.node)) {
            arrowExpr = path.node;
            break;
        }
        if (
            path.parent &&
            j.ArrowFunctionExpression.check(path.parent.node) &&
            path.parent.node.body === path.node
        ) {
            return false;
        }
        path = path.parent;
    }
    if (!arrowExpr) {
        return false;
    }

    // 2. Check parameters and parens
    if (arrowExpr.params.length !== 1 || !j.Identifier.check(arrowExpr.params[0])) {
        return false;
    }

    const noParens = arrowExpr.start === arrowExpr.params[0].start;
    return noParens;
};

codeMod.scope = 'cursor';

codeMod.title = 'Wrap parameter with ()';

codeMod.description = '';

codeMod.detail = '';

module.exports = codeMod;
