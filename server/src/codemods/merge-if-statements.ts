import { AstNode, Expression, IfStatement, Statement } from 'ast-types';
import { NodePath } from 'ast-types';
import { Collection, JsCodeShift } from 'jscodeshift';

import { CodeModExports } from '../codeModTypes';
import { getSingleStatement } from '../utils/astHelpers';

function getParentIf(j: JsCodeShift, path: NodePath<AstNode>): NodePath<IfStatement> | null {
    if (path.parent && j.IfStatement.check(path.parent.node)) {
        return path.parent as NodePath<IfStatement>;
    }
    if (path.parent.parent && j.IfStatement.check(path.parent.parent.node)) {
        return path.parent.parent as NodePath<IfStatement>;
    }
    return null;
}

function isMergableChildIf(j: JsCodeShift, n: AstNode | null): n is IfStatement {
    return Boolean(n && j.IfStatement.check(n) && !n.alternate);
}
function getValidParentIf(j: JsCodeShift, path: NodePath<AstNode>) {
    const parentIf = getParentIf(j, path);
    const validParent =
        parentIf &&
        isMergableChildIf(j, parentIf.node) &&
        getSingleStatement(j, parentIf.node.consequent) === path.node;
    return validParent ? parentIf : null;
}

const codeMod: CodeModExports = ((fileInfo, api, options) => {
    const j = api.jscodeshift;
    const ast = fileInfo.ast;
    const target = options.target;

    const path = target.firstPath<IfStatement>()!;

    let topIf: NodePath<IfStatement> = path;
    let ifArr: Array<IfStatement> = [];
    let currentPath: NodePath<IfStatement> | null = path;
    while (currentPath) {
        let parent = getValidParentIf(j, currentPath);
        if (parent) {
            topIf = parent;
            ifArr.unshift(parent.node);
        }
        currentPath = parent;
    }

    let currentNode: Statement | null = path.node;
    while (isMergableChildIf(j, currentNode)) {
        ifArr.push(currentNode);
        currentNode = getSingleStatement(j, currentNode.consequent);
    }

    const testExpression = ifArr
        .map((s) => s.test)
        .reduce(
            (prev, current) => (prev ? j.logicalExpression('&&', prev, current) : current),
            null as Expression | null
        )!;
    const consequentStatement = ifArr[ifArr.length - 1].consequent;

    const newIfStatement = j.ifStatement(testExpression, consequentStatement);
    newIfStatement.comments = topIf.node.comments;
    topIf.replace(newIfStatement);

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

    // For any IF that we are on, there are two options:
    // - valid if, valid child if
    // - valid if, valid parent if
    if (isMergableChildIf(j, path.node)) {
        const childConsequent = getSingleStatement(j, path.node.consequent);
        if (isMergableChildIf(j, childConsequent)) {
            // valid child if
            return true;
        }
        // valid parent if
        return Boolean(getValidParentIf(j, path));
    }

    return false;
};

codeMod.scope = 'cursor';

codeMod.title = 'Merge into one if-statement';

codeMod.description = '';

codeMod.detail = '';

module.exports = codeMod;
