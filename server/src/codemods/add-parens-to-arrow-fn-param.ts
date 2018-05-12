import {
    ArrowFunctionExpression,
    Expression,
    FunctionDeclaration,
    Identifier,
    IfStatement,
    Printable,
    UnaryExpression
} from 'ast-types';
import { Collection, JsCodeShift } from 'jscodeshift';
import { CodeModExports } from '../codeModTypes';

const codeMod: CodeModExports = (fileInfo, api, options) => {
    const j = api.jscodeshift;
    const ast = fileInfo.ast;
    const target = options.target;
    const node = target.thisOrClosest(j.ArrowFunctionExpression).firstNode()!;

    const param = node.params[0] as Identifier;
    param.name = `(${param.name})`; // Messing with Identifier as it's the only way to force the printer to print parens

    const resultText = ast.toSource();
    return resultText;
};

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

codeMod.title = 'Add parens to arrow function parameter';

codeMod.description = '';

codeMod.detail = '';

module.exports = codeMod;
