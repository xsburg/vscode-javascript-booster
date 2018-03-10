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
    TemplateElement,
    VariableDeclaration,
    Identifier,
    VariableDeclarator,
    BlockStatement,
    NodePath,
    ExpressionStatement,
    AssignmentExpression
} from 'ast-types';
import { Collection, JsCodeShift } from 'jscodeshift';

function getSingleExpressionStatement(j: JsCodeShift, n: Node): ExpressionStatement {
    if (j.ExpressionStatement.check(n)) {
        return n;
    }
    if (
        j.BlockStatement.check(n) &&
        n.body.length === 1 &&
        j.ExpressionStatement.check(n.body[0])
    ) {
        return n.body[0] as any;
    }
    return null;
}

let codeMod: CodeModExports = function(fileInfo, api, options) {
    const j = api.jscodeshift;
    const ast = fileInfo.ast;
    const target = options.target;
    const path = target.thisOrClosest(j.IfStatement).firstPath()!;

    const conExpr = getSingleExpressionStatement(j, path.node.consequent)
        .expression as AssignmentExpression;
    const altExpr = getSingleExpressionStatement(j, path.node.alternate!)
        .expression as AssignmentExpression;

    const name = (conExpr.left as Identifier).name;

    const result = j.expressionStatement(
        j.assignmentExpression(
            '=',
            j.identifier(name),
            j.conditionalExpression(path.node.test, conExpr.right, altExpr.right)
        )
    );
    path.replace(result);

    let resultText = ast.toSource();
    return resultText;
};

codeMod.canRun = function(fileInfo, api, options) {
    const j = api.jscodeshift;
    const ast = fileInfo.ast;
    const target = options.target;
    const node = target.thisOrClosest(j.IfStatement).firstNode();

    if (!node || !node.alternate) {
        return false;
    }

    const conStatement = getSingleExpressionStatement(j, node.consequent);
    const altStatement = getSingleExpressionStatement(j, node.alternate);
    if (!conStatement || !altStatement) {
        return false;
    }

    const conName =
        j.AssignmentExpression.check(conStatement.expression) &&
        j.Identifier.check(conStatement.expression.left) &&
        conStatement.expression.left.name;
    const altName =
        j.AssignmentExpression.check(altStatement.expression) &&
        j.Identifier.check(altStatement.expression.left) &&
        altStatement.expression.left.name;
    return conName && altName && conName === altName;
};

codeMod.scope = 'cursor';

codeMod.title = 'Replace if-else with ?:';

codeMod.description = '';

codeMod.detail = '';

module.exports = codeMod;
