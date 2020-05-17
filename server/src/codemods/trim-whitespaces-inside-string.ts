import { AstNode, NodePath, StringLiteral, TSEnumDeclaration } from 'ast-types';
import { JsCodeShift } from 'jscodeshift';

import { CodeModExports } from '../codeModTypes';
import * as astHelpers from '../utils/astHelpers';

function getEnumDeclaration(path: NodePath<AstNode> | null, j: JsCodeShift) {
    let enumDeclaration: NodePath<TSEnumDeclaration> | null = null;
    if (path) {
        if (j.TSEnumDeclaration.check(path.node)) {
            enumDeclaration = path as NodePath<TSEnumDeclaration>;
        } else if (j.Identifier.check(path.node) && j.TSEnumDeclaration.check(path.parent.node)) {
            enumDeclaration = path.parent as NodePath<TSEnumDeclaration>;
        }
    }
    return enumDeclaration;
}

const codeMod: CodeModExports = ((fileInfo, api, options) => {
    const j = api.jscodeshift;
    const ast = fileInfo.ast;
    const target = options.target;
    const node = target.firstNode<StringLiteral>()!;

    node.value = node.value.trim();

    const resultText = ast.toSource();
    return resultText;
}) as CodeModExports;

codeMod.canRun = (fileInfo, api, options) => {
    const j = api.jscodeshift;
    const target = options.target;

    let path = target.firstPath();

    const isStringExpr = astHelpers.isStringExpression(j, path);
    if (!isStringExpr) {
        return false;
    }
    const node = path!.node as StringLiteral;
    return node.value.trim().length !== node.value.length;
};

codeMod.scope = 'cursor';

codeMod.title = 'Trim whitespaces inside string';

codeMod.description = '';

codeMod.detail = '';

module.exports = codeMod;
