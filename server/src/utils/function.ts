import {
    AssignmentExpression,
    AstNode,
    FunctionDeclaration,
    NodePath,
    VariableDeclaration,
} from 'ast-types';
import { JsCodeShift } from 'jscodeshift';

/**
 * Returns the VariableDeclaration that declares a function if the path (= user cursor) is directly over it.
 *
 * Examples of "directly over it":
 * const fo|o = () => {};
 * const foo = () =|> {};
 * const foo = functi|on() {};
 * co|nst foo = () => {};
 */
export function getVariableDeclaration(
    j: JsCodeShift,
    path: NodePath<AstNode>
): NodePath<VariableDeclaration> | null {
    let checkTarget: NodePath<AstNode> | undefined;
    if (j.Identifier.check(path.node) && j.VariableDeclarator.check(path.parent.node)) {
        // const fo|o = () => {};
        checkTarget = path.parent.parent;
    } else if (
        j.ArrowFunctionExpression.check(path.node) ||
        j.FunctionExpression.check(path.node)
    ) {
        // const foo = () =|> {};
        // const foo = functi|on() {};
        checkTarget = path.parent.parent;
    } else if (j.VariableDeclarator.check(path.node)) {
        // const foo |= () => {};
        checkTarget = path.parent;
    } else if (j.VariableDeclaration.check(path.node)) {
        // co|nst foo = () => {};
        checkTarget = path;
    } else {
        const typeAnnotation = j(path).thisOrClosest(j.TSTypeAnnotation).firstPath();
        // annotation => identifier => declarator => declaration
        if (typeAnnotation) {
            checkTarget = typeAnnotation.parent?.parent?.parent;
        }
    }
    if (!checkTarget) {
        return null;
    }
    const preconditionsMet =
        // Check VariableDeclaration
        j.VariableDeclaration.check(checkTarget.node) &&
        checkTarget.node.declarations.length === 1 &&
        // Check VariableDeclarator
        j.VariableDeclarator.check(checkTarget.node.declarations[0]) &&
        j.Identifier.check(checkTarget.node.declarations[0].id) &&
        (j.ArrowFunctionExpression.check(checkTarget.node.declarations[0].init) ||
            j.FunctionExpression.check(checkTarget.node.declarations[0].init));
    if (!preconditionsMet) {
        return null;
    }
    return checkTarget as any;
}

/**
 * Returns the FunctionDeclaration if the path (= user cursor) is directly over it.
 *
 * Examples of "directly over it":
 * function fo|o() {};
 * funct|ion foo() {};
 */
export function getFunctionDeclaration(
    j: JsCodeShift,
    path: NodePath<AstNode>
): NodePath<FunctionDeclaration> | null {
    if (j.Identifier.check(path.node) && j.FunctionDeclaration.check(path.parent.node)) {
        // function fo|o() {};
        return path.parent as any;
    } else if (j.FunctionDeclaration.check(path.node)) {
        // funct|ion foo() {};
        return path as any;
    }
    return null;
}

/**
 * Returns the AssignmentExpression if the path (= user cursor) is directly over it.
 *
 * Examples of "directly over it":
 * fo|o = () => {};
 * foo = () =|> {};
 * foo = functi|on() {};
 * foo |= () => {};
 */
export function getAssignmentExpression(
    j: JsCodeShift,
    path: NodePath<AstNode>
): NodePath<AssignmentExpression> | null {
    let checkTarget: NodePath<AstNode> | undefined;
    if (j.Identifier.check(path.node) && j.AssignmentExpression.check(path.parent.node)) {
        // fo|o = () => {};
        checkTarget = path.parent;
    } else if (
        j.ArrowFunctionExpression.check(path.node) ||
        j.FunctionExpression.check(path.node)
    ) {
        // foo = () =|> {};
        // foo = functi|on() {};
        checkTarget = path.parent;
    } else if (j.AssignmentExpression.check(path.node)) {
        // foo |= () => {};
        checkTarget = path;
    }
    if (!checkTarget) {
        return null;
    }
    const preconditionsMet =
        j.AssignmentExpression.check(checkTarget.node) &&
        j.ExpressionStatement.check(checkTarget.parent.node) &&
        checkTarget.node.operator === '=' &&
        j.Identifier.check(checkTarget.node.left) &&
        (j.ArrowFunctionExpression.check(checkTarget.node.right) ||
            j.FunctionExpression.check(checkTarget.node.right));
    if (!preconditionsMet) {
        return null;
    }
    return checkTarget as any;
}
