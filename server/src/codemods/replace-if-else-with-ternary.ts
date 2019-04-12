import {
    AssignmentExpression,
    AstNode,
    BinaryExpression,
    BlockStatement,
    Expression,
    ExpressionStatement,
    FunctionDeclaration,
    Identifier,
    IfStatement,
    Node,
    NodePath,
    Printable,
    ReturnStatement,
    Statement,
    TemplateElement,
    UnaryExpression,
    VariableDeclaration,
    VariableDeclarator
} from 'ast-types';
import { Collection, JsCodeShift } from 'jscodeshift';
import { CodeModExports } from '../codeModTypes';
import { getNextStatementInBlock, getSingleStatement } from '../utils/astHelpers';

function getFragmentMeta(j: JsCodeShift, target: Collection<AstNode>) {
    const path = target.thisOrClosest(j.IfStatement).firstPath();

    if (!path) {
        return null;
    }

    const conStatement = getSingleStatement(j, path.node.consequent);
    const altStatement = getSingleStatement(j, path.node.alternate);
    if (!conStatement) {
        return null;
    }

    let isAssignmentToOneVar = false;
    const conIsReturn = j.ReturnStatement.check(conStatement) && conStatement.argument;
    const conIsExprStatement = j.ExpressionStatement.check(conStatement);
    let altIsReturn;
    let altIsExprStatement;

    if (altStatement) {
        // 1. AssignmentExpression in both branches
        const conName =
            j.ExpressionStatement.check(conStatement) &&
            j.AssignmentExpression.check(conStatement.expression) &&
            j.Identifier.check(conStatement.expression.left) &&
            conStatement.expression.left.name;
        const altName =
            j.ExpressionStatement.check(altStatement) &&
            j.AssignmentExpression.check(altStatement.expression) &&
            j.Identifier.check(altStatement.expression.left) &&
            altStatement.expression.left.name;
        isAssignmentToOneVar = Boolean(conName && altName && conName === altName);
        // 2.1 if () { return a; } else { return b; }
        altIsReturn = j.ReturnStatement.check(altStatement) && altStatement.argument;
        // 3. if () { foo(); } else { bar; }
        altIsExprStatement = j.ExpressionStatement.check(altStatement);
    } else {
        // 2.2 if() { return a; } return b;
        const nextStatement = getNextStatementInBlock(j, path);
        altIsReturn = j.ReturnStatement.check(nextStatement) && nextStatement.argument;
    }

    const isIfElseReturn = Boolean(conIsReturn && altIsReturn);
    const isExprStatementPair =
        Boolean(conIsExprStatement && altIsExprStatement) && !isAssignmentToOneVar;
    return {
        isAssignmentToOneVar,
        isIfElseReturn,
        isExprStatementPair
    };
}

const codeMod: CodeModExports = ((fileInfo, api, options) => {
    const j = api.jscodeshift;
    const ast = fileInfo.ast;
    const target = options.target;
    const path = target.thisOrClosest(j.IfStatement).firstPath()!;

    const conStatement = getSingleStatement(j, path.node.consequent)!;
    const altStatement = getSingleStatement(j, path.node.alternate!);
    const nextStatement = getNextStatementInBlock(j, path);
    const meta = getFragmentMeta(j, target)!;

    let result;
    if (meta.isIfElseReturn) {
        // if-return-else
        const conExpr = (conStatement as ReturnStatement).argument!;
        let altExpr;
        if (altStatement) {
            altExpr = (altStatement as ReturnStatement).argument!;
        } else {
            altExpr = (nextStatement as ReturnStatement).argument!;
            path.parentPath.value.splice(path.parentPath.value.indexOf(nextStatement), 1);
        }

        result = j.returnStatement(j.conditionalExpression(path.node.test, conExpr, altExpr));
    } else if (meta.isAssignmentToOneVar) {
        // if-else assignment
        const conExpr = (conStatement as ExpressionStatement).expression as AssignmentExpression;
        const altExpr = (altStatement as ExpressionStatement).expression as AssignmentExpression;

        const name = (conExpr.left as Identifier).name;

        result = j.expressionStatement(
            j.assignmentExpression(
                '=',
                j.identifier(name),
                j.conditionalExpression(path.node.test, conExpr.right, altExpr.right)
            )
        );
    } else {
        // is-else expression statement
        const conExpr = (conStatement as ExpressionStatement).expression;
        const altExpr = (altStatement as ExpressionStatement).expression;

        result = j.expressionStatement(j.conditionalExpression(path.node.test, conExpr, altExpr));
    }

    path.replace(result);

    const resultText = ast.toSource();
    return resultText;
}) as CodeModExports;

codeMod.canRun = (fileInfo, api, options) => {
    const j = api.jscodeshift;
    const target = options.target;

    const meta = getFragmentMeta(j, target);
    return Boolean(
        meta && (meta.isAssignmentToOneVar || meta.isIfElseReturn || meta.isExprStatementPair)
    );
};

codeMod.scope = 'cursor';

codeMod.title = 'Replace with ?:';

codeMod.description = '';

codeMod.detail = '';

module.exports = codeMod;
