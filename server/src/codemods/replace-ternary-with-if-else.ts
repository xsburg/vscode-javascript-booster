import {
    AssignmentExpression,
    AstNode,
    ConditionalExpression,
    ExpressionStatement,
    Identifier,
    NodePath,
    ReturnStatement,
    VariableDeclaration,
    VariableDeclarator
} from 'ast-types';
import { Collection, JsCodeShift } from 'jscodeshift';
import { CodeModExports } from '../codeModTypes';
import { getNextStatementInBlock, getSingleStatement } from '../utils/astHelpers';

enum TransformType {
    None,
    /**
     * 1 ? 1 : 0;
     */
    TernaryStatement,
    /**
     * foo = 1 ? 1 : 0;
     */
    AssignmentStatement,
    /**
     * let foo = 1 ? 1 : 0;
     */
    VariableDeclaration
}

function getTransformType(j: JsCodeShift, target: Collection<AstNode>) {
    const path = target.firstPath();

    if (!path || !j.ConditionalExpression.check(path.node) || !path.parent) {
        return TransformType.None;
    }

    const parentNode = path.parent.node;

    if (j.ExpressionStatement.check(parentNode)) {
        return TransformType.TernaryStatement;
    }

    if (
        j.AssignmentExpression.check(parentNode) &&
        j.ExpressionStatement.check(path.parent.parent && path.parent.parent.node)
    ) {
        return TransformType.AssignmentStatement;
    }

    if (
        j.VariableDeclarator.check(parentNode) &&
        j.VariableDeclaration.check(path.parent.parent && path.parent.parent.node)
    ) {
        return TransformType.VariableDeclaration;
    }

    return TransformType.None;
}

const codeMod: CodeModExports = ((fileInfo, api, options) => {
    const j = api.jscodeshift;
    const ast = fileInfo.ast;
    const target = options.target;
    const path = target.firstPath()!;
    const node = path.node as ConditionalExpression;

    const transformType = getTransformType(j, target);
    switch (transformType) {
        case TransformType.TernaryStatement:
            // Simple case: a?b:c expression => if (a) {b} else {c}
            path.parent.replace(
                j.ifStatement(
                    node.test,
                    j.blockStatement([j.expressionStatement(node.consequent)]),
                    j.blockStatement([j.expressionStatement(node.alternate)])
                )
            );
            break;
        case TransformType.AssignmentStatement: {
            // Assignment: x = a?b:c => if (a) {x = b} else {x = c}
            const assignmentExpr = path.parent.node as AssignmentExpression;
            path.parent.parent.replace(
                j.ifStatement(
                    node.test,
                    j.blockStatement([
                        j.expressionStatement(
                            j.assignmentExpression('=', assignmentExpr.left, node.consequent)
                        )
                    ]),
                    j.blockStatement([
                        j.expressionStatement(
                            j.assignmentExpression('=', assignmentExpr.left, node.alternate)
                        )
                    ])
                )
            );
            break;
        }
        case TransformType.VariableDeclaration: {
            // Variable declaration: let x = a?b:c; => let x; if (a) {x = b} else {x = c}
            // Tricky case 1: convert const to let
            // Tricky case 2: multiple declarations. Split the declarations.
            const varDeclarator = path.parent as NodePath<VariableDeclarator>;
            const varDeclaration = path.parent.parent as NodePath<VariableDeclaration>;
            const newIfStatement = j.ifStatement(
                node.test,
                j.blockStatement([
                    j.expressionStatement(
                        j.assignmentExpression('=', varDeclarator.node.id, node.consequent)
                    )
                ]),
                j.blockStatement([
                    j.expressionStatement(
                        j.assignmentExpression('=', varDeclarator.node.id, node.alternate)
                    )
                ])
            );
            varDeclarator.node.init = null;
            const declaratorIndex = varDeclaration.node.declarations.indexOf(varDeclarator.node);
            let newDeclaration;
            if (declaratorIndex < varDeclaration.node.declarations.length - 1) {
                // tricky case 2
                const newDeclarators = varDeclaration.node.declarations.splice(declaratorIndex + 1);
                newDeclaration = j.variableDeclaration(varDeclaration.node.kind, newDeclarators);
            }

            if (varDeclaration.node.kind === 'const') {
                // Tricky case 1
                varDeclaration.node.kind = 'let';
            }

            if (newDeclaration) {
                varDeclaration.insertAfter(newDeclaration);
            }
            varDeclaration.insertAfter(newIfStatement);
            break;
        }
        default:
            throw new Error(`Transform type "${transformType}" is not supported.`);
    }

    const resultText = ast.toSource();
    return resultText;
}) as CodeModExports;

codeMod.canRun = (fileInfo, api, options) => {
    const j = api.jscodeshift;
    const target = options.target;

    return getTransformType(j, target) !== TransformType.None;
};

codeMod.scope = 'cursor';

codeMod.title = 'Replace ?: with if-else';

codeMod.description = '';

codeMod.detail = '';

module.exports = codeMod;
