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
import { CodeModExports } from '../models/CodeMod';

/**
 * Returns one expression when the parameter n is: "{ oneExpression; }" or "oneExpression;"
 * @param j codeshift
 * @param n node to check
 */
function getSingleStatement(j: JsCodeShift, n: Node): Statement | null {
    if (j.BlockStatement.check(n) && n.body.length === 1) {
        return getSingleStatement(j, n.body[0]);
    }
    if (j.Statement.check(n)) {
        return n;
    }
    return null;
}

const codeMod: CodeModExports = (fileInfo, api, options) => {
    const j = api.jscodeshift;
    const ast = fileInfo.ast;
    const target = options.target;
    const path = target.thisOrClosest(j.IfStatement).firstPath()!;

    const conStatement = getSingleStatement(j, path.node.consequent)!;
    const altStatement = getSingleStatement(j, path.node.alternate!)!;

    let result;
    if (j.ReturnStatement.check(conStatement) && j.ReturnStatement.check(altStatement)) {
        // if-return-else
        const conExpr = conStatement.argument as AssignmentExpression;
        const altExpr = altStatement.argument as AssignmentExpression;

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
    const node = target.thisOrClosest(j.IfStatement).firstNode();

    if (!node || !node.alternate) {
        return false;
    }

    const conStatement = getSingleStatement(j, node.consequent);
    const altStatement = getSingleStatement(j, node.alternate);
    if (!conStatement || !altStatement) {
        return false;
    }

    // 1. AssignmentExpression in both branches
    // OR
    // 2. Return expression in both branches
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
    const isAssignmentToOneVar = Boolean(conName && altName && conName === altName);

    const conIsReturn = j.ReturnStatement.check(conStatement);
    const altIsReturn = j.ReturnStatement.check(altStatement);
    const isIfElseReturn = conIsReturn && altIsReturn;

    return isAssignmentToOneVar || isIfElseReturn;
};

codeMod.scope = 'cursor';

codeMod.title = 'Replace if-else with ?:';

codeMod.description = '';

codeMod.detail = '';

module.exports = codeMod;
