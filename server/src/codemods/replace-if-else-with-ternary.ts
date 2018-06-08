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

const codeMod: CodeModExports = (fileInfo, api, options) => {
    const j = api.jscodeshift;
    const ast = fileInfo.ast;
    const target = options.target;
    const path = target.thisOrClosest(j.IfStatement).firstPath()!;

    const conStatement = getSingleStatement(j, path.node.consequent)!;
    const altStatement = getSingleStatement(j, path.node.alternate!);
    const nextStatement = getNextStatementInBlock(j, path);

    let result;
    if (j.ReturnStatement.check(conStatement)) {
        // if-return-else
        const conExpr = conStatement.argument!;
        let altExpr;
        if (altStatement) {
            altExpr = (altStatement as ReturnStatement).argument!;
        } else {
            altExpr = (nextStatement as ReturnStatement).argument!;
            path.parentPath.value.splice(path.parentPath.value.indexOf(nextStatement), 1);
        }

        result = j.returnStatement(j.conditionalExpression(path.node.test, conExpr, altExpr));
    } else {
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
    }

    path.replace(result);

    const resultText = ast.toSource();
    return resultText;
};

codeMod.canRun = (fileInfo, api, options) => {
    const j = api.jscodeshift;
    const ast = fileInfo.ast;
    const target = options.target;
    const path = target.thisOrClosest(j.IfStatement).firstPath();

    if (!path) {
        return false;
    }

    const conStatement = getSingleStatement(j, path.node.consequent);
    const altStatement = getSingleStatement(j, path.node.alternate);
    if (!conStatement) {
        return false;
    }

    let isAssignmentToOneVar;
    const conIsReturn = j.ReturnStatement.check(conStatement) && conStatement.argument;
    let altIsReturn;

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
    } else {
        // 2.2 if() { return a; } return b;
        const nextStatement = getNextStatementInBlock(j, path);
        altIsReturn = j.ReturnStatement.check(nextStatement) && nextStatement.argument;
    }

    const isIfElseReturn = Boolean(conIsReturn && altIsReturn);
    return isAssignmentToOneVar || isIfElseReturn;
};

codeMod.scope = 'cursor';

codeMod.title = 'Replace with ?:';

codeMod.description = '';

codeMod.detail = '';

module.exports = codeMod;
