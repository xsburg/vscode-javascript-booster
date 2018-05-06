import {
    ArrowFunctionExpression,
    BlockStatement,
    CallExpression,
    Expression,
    FunctionDeclaration,
    FunctionExpression,
    IfStatement,
    MemberExpression,
    Printable,
    ReturnStatement,
    UnaryExpression
} from 'ast-types';
import { Collection, JsCodeShift } from 'jscodeshift';
import { CodeModExports } from '../models/CodeMod';

function canRunBindExprTransform(j: JsCodeShift, target: Collection) {
    const callExpression = target.thisOrClosest(j.CallExpression).firstNode();
    if (!callExpression) {
        return false;
    }

    const functionExpression = target.closest(j.FunctionExpression).firstNode();
    const isBoundFunctionExpression =
        j.MemberExpression.check(callExpression.callee) &&
        j.FunctionExpression.check(callExpression.callee.object) &&
        j.Identifier.check(callExpression.callee.property) &&
        callExpression.arguments.length === 1 &&
        j.ThisExpression.check(callExpression.arguments[0]);

    // 1. Somewhere over function(){}.bind()
    // 2. Outside the function definition
    return (
        isBoundFunctionExpression &&
        (callExpression.callee as MemberExpression).object !== functionExpression
    );
}

function canRunFunctionExprTransform(j: JsCodeShift, target: Collection) {
    if (!j.FunctionExpression.check(target.firstNode())) {
        return false;
    }

    return target.find(j.ThisExpression).length === 0;
}

const codeMod: CodeModExports = (fileInfo, api, options) => {
    const j = api.jscodeshift;
    const ast = fileInfo.ast;
    const target = options.target;

    if (canRunBindExprTransform(j, target)) {
        const $callExpression = target.thisOrClosest(j.CallExpression);
        const functionExpr = ($callExpression.firstNode()!.callee as MemberExpression)
            .object as FunctionExpression;
        const arrowExpr = j.arrowFunctionExpression(functionExpr.params, functionExpr.body, false);
        if (functionExpr.returnType) {
            arrowExpr.returnType = functionExpr.returnType;
        }
        $callExpression.replaceWith(arrowExpr);
    } else if (canRunFunctionExprTransform(j, target)) {
        const functionExpr = target.firstNode() as FunctionExpression;
        const arrowExpr = j.arrowFunctionExpression(functionExpr.params, functionExpr.body, false);
        if (functionExpr.returnType) {
            arrowExpr.returnType = functionExpr.returnType;
        }
        target.replaceWith(arrowExpr);
    }

    const resultText = ast.toSource();
    return resultText;
};

codeMod.canRun = (fileInfo, api, options) => {
    const j = api.jscodeshift;
    const ast = fileInfo.ast;
    const target = options.target;

    return canRunBindExprTransform(j, target) || canRunFunctionExprTransform(j, target);
};

codeMod.scope = 'cursor';

codeMod.title = 'Convert to arrow function';

codeMod.description = '';

codeMod.detail = '';

module.exports = codeMod;
