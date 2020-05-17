import {
    AstNode,
    BinaryExpression,
    BlockStatement,
    Expression,
    FunctionDeclaration,
    Identifier,
    IfStatement,
    Node,
    NodePath,
    Printable,
    TemplateElement,
    UnaryExpression,
    VariableDeclaration,
    VariableDeclarator,
} from 'ast-types';
import { Collection, JsCodeShift } from 'jscodeshift';
import { CodeModExports } from '../codeModTypes';

const codeMod: CodeModExports = ((fileInfo, api, options) => {
    const j = api.jscodeshift;
    const ast = fileInfo.ast;
    const target = options.target;
    const declarationPath = target.thisOrClosest(j.VariableDeclaration).firstPath()!;
    const declarationNode = declarationPath.node;
    const blockStatementPath = declarationPath.parent as NodePath<BlockStatement>;

    // Go through scope statements and find assignments
    // Then check if assigned vars exist in target declaration and update them
    blockStatementPath.node.body.forEach((d) => {
        if (
            j.ExpressionStatement.check(d) &&
            j.AssignmentExpression.check(d.expression) &&
            j.Identifier.check(d.expression.left)
        ) {
            const name = d.expression.left.name;
            const matchedDeclarator = declarationNode.declarations.find(
                (dtor) =>
                    (j.Identifier.check(dtor) && dtor.name === name) ||
                    (j.VariableDeclarator.check(dtor) &&
                        !dtor.init &&
                        j.Identifier.check(dtor.id) &&
                        dtor.id.name === name)
            );
            if (!matchedDeclarator) {
                return;
            }
            // Remove declarator from target declaration
            declarationNode.declarations.splice(
                declarationNode.declarations.indexOf(matchedDeclarator),
                1
            );
            // Update assignment expression into declaration
            const newDeclaration = j.variableDeclaration(declarationNode.kind, [
                j.variableDeclarator(j.identifier(name), d.expression.right),
            ]);
            blockStatementPath.node.body.splice(
                blockStatementPath.node.body.indexOf(d),
                1,
                newDeclaration
            );
        }
    });

    if (declarationNode.declarations.length === 0) {
        declarationPath.prune();
    }

    const resultText = ast.toSource();
    return resultText;
}) as CodeModExports;

codeMod.canRun = (fileInfo, api, options) => {
    const j = api.jscodeshift;
    const ast = fileInfo.ast;
    const target = options.target;
    const path = target.thisOrClosest(j.VariableDeclaration).firstPath();
    if (!path || !(j.BlockStatement.check(path.parent.node) || j.Program.check(path.parent.node))) {
        return false;
    }

    const candidateIdentifiers: Identifier[] = [];
    path.node.declarations.forEach((d) => {
        if (j.Identifier.check(d)) {
            candidateIdentifiers.push(d);
        }
        const declarator = d as VariableDeclarator;
        if (j.Identifier.check(declarator.id) && !declarator.init) {
            candidateIdentifiers.push(declarator.id);
        }
    });

    if (candidateIdentifiers.length === 0) {
        return false;
    }

    const names = candidateIdentifiers.map((i) => i.name);
    const hasAssignmentsInScope = (path.parent.node as BlockStatement).body.some(
        (d) =>
            j.ExpressionStatement.check(d) &&
            j.AssignmentExpression.check(d.expression) &&
            j.Identifier.check(d.expression.left) &&
            names.indexOf(d.expression.left.name) !== -1
    );

    return hasAssignmentsInScope;
};

codeMod.scope = 'cursor';

codeMod.title = 'Merge declaration and initialization';

codeMod.description = '';

codeMod.detail = '';

module.exports = codeMod;
