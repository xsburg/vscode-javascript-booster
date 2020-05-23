import { AstNode, NodePath, StringLiteral, TSEnumDeclaration } from 'ast-types';
import { JsCodeShift } from 'jscodeshift';

import { CodeModExports } from '../codeModTypes';

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
    const path = target.firstPath();

    const enumDeclaration = getEnumDeclaration(path, j)!;

    const values = enumDeclaration.node.members.map((m) => (m.initializer as StringLiteral).value);

    const newDeclaration = j.tsTypeAliasDeclaration(
        j.identifier(enumDeclaration.node.id.name),
        j.tsUnionType(values.map((v) => j.tsLiteralType(j.stringLiteral(v))))
    );
    newDeclaration.comments = enumDeclaration.node.comments;
    enumDeclaration.replace(newDeclaration);

    const resultText = ast.toSource();
    return resultText;
}) as CodeModExports;

codeMod.canRun = (fileInfo, api, options) => {
    const j = api.jscodeshift;
    const target = options.target;
    const path = target.firstPath();

    // 1. Find enum declaration
    let enumDeclaration = getEnumDeclaration(path, j);
    if (!enumDeclaration) {
        return false;
    }

    // 2. Validate that it can be converted
    for (let member of enumDeclaration.node.members) {
        if (!member.initializer || member.initializer.type !== 'StringLiteral') {
            return false;
        }
    }
    return true;
};

codeMod.scope = 'cursor';

codeMod.languageScope = ['typescript', 'typescriptreact'];

codeMod.title = 'Convert string enum to type union';

codeMod.description = '';

codeMod.detail = '';

module.exports = codeMod;
