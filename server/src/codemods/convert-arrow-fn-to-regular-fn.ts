import {
    ArrowFunctionExpression,
    AstNode,
    BlockStatement,
    Expression,
    ExpressionStatement,
    FunctionDeclaration,
    Identifier,
    IfStatement,
    Pattern,
    Printable,
    ReturnStatement,
    TSType,
    UnaryExpression,
    VariableDeclarator,
} from 'ast-types';
import { Collection, JsCodeShift } from 'jscodeshift';

import { CodeModExports } from '../codeModTypes';
import { getVariableDeclaration } from '../utils/function';
import { getPropsTypeFromVariableDeclaratorId } from '../utils/react';

function withFirstParamTypeAnnotations(
    j: JsCodeShift,
    params: Pattern[],
    propsType: TSType | null
) {
    if (params.length === 0 || !propsType) {
        return params;
    }
    const firstParam = params[0];
    if (j.Identifier.check(firstParam) || j.ObjectPattern.check(firstParam)) {
        firstParam.typeAnnotation = j.tsTypeAnnotation(propsType);
    }
    return params;
}

const codeMod: CodeModExports = ((fileInfo, api, options) => {
    const j = api.jscodeshift;
    const ast = fileInfo.ast;
    const target = options.target;
    const $variableDeclaration = target.thisOrClosest(j.VariableDeclaration);

    const varDeclaration = $variableDeclaration.firstNode()!;
    const varDeclarator = varDeclaration.declarations[0] as VariableDeclarator;
    const fnName = (varDeclarator.id as Identifier).name;
    const arrowExpr = varDeclarator.init as ArrowFunctionExpression;
    const body = j.BlockStatement.check(arrowExpr.body)
        ? arrowExpr.body
        : j.blockStatement([j.returnStatement(arrowExpr.body)]);
    const propsType = getPropsTypeFromVariableDeclaratorId(j, varDeclarator.id as Identifier);
    const resultFn = j.functionDeclaration(
        j.identifier(fnName),
        withFirstParamTypeAnnotations(j, arrowExpr.params, propsType),
        body
    );
    resultFn.comments = varDeclaration.comments;
    resultFn.returnType = arrowExpr.returnType;
    resultFn.generator = arrowExpr.generator;
    $variableDeclaration.replaceWith(resultFn);

    const resultText = ast.toSource();
    return resultText;
}) as CodeModExports;

codeMod.canRun = (fileInfo, api, options) => {
    const j = api.jscodeshift;
    const ast = fileInfo.ast;
    const target = options.target;
    const path = target.firstPath();

    if (!path) {
        return false;
    }

    const variableDeclaration = getVariableDeclaration(j, path);
    const isVarDecl = Boolean(
        (variableDeclaration && (variableDeclaration.node.declarations[0] as VariableDeclarator))!
            .init!.type === j.ArrowFunctionExpression.name
    );

    if (!isVarDecl) {
        return false;
    }
    const usesThisExpr = j(variableDeclaration).find(j.ThisExpression).length > 0;
    return !usesThisExpr;
};

codeMod.scope = 'cursor';

codeMod.title = 'Convert to regular function';

codeMod.description = '';

codeMod.detail = '';

module.exports = codeMod;
