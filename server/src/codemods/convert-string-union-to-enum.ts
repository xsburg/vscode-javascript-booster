import {
    AstNode,
    NodePath,
    StringLiteral,
    TSEnumDeclaration,
    TSTypeAliasDeclaration,
    TSUnionType,
} from 'ast-types';
import { JsCodeShift } from 'jscodeshift';
import * as _ from 'lodash';

import { CodeModExports } from '../codeModTypes';

function getEnumKey(value: string) {
    return _.upperFirst(_.camelCase(value));
}

const codeMod: CodeModExports = ((fileInfo, api, options) => {
    const j = api.jscodeshift;
    const ast = fileInfo.ast;
    const target = options.target;
    const tsTypeAliasDecl = target.thisOrClosest(j.TSTypeAliasDeclaration, {
        typeAnnotation: { type: 'TSUnionType' },
    } as TSTypeAliasDeclaration);

    const values = _.uniq(
        tsTypeAliasDecl
            .find(j.TSLiteralType)
            .nodes()
            .map((n) => (n.literal as StringLiteral).value)
    );
    const enumName = tsTypeAliasDecl.firstNode()!.id.name;

    const result = j.tsEnumDeclaration(
        j.identifier(enumName),
        values.map((v) => j.tsEnumMember(j.identifier(getEnumKey(v)), j.stringLiteral(v)))
    );
    result.comments = tsTypeAliasDecl.firstNode()!.comments;
    tsTypeAliasDecl.replaceWith(result);
    const parentNode = tsTypeAliasDecl.firstPath()!.parent.node;
    if (j.ExportNamedDeclaration.check(parentNode)) {
        // export type => export
        parentNode.exportKind = 'value';
    }

    const resultText = ast.toSource();
    return resultText;
}) as CodeModExports;

codeMod.canRun = (fileInfo, api, options) => {
    const j = api.jscodeshift;
    const target = options.target;
    const tsTypeAliasDecl = target
        .thisOrClosest(j.TSTypeAliasDeclaration, {
            typeAnnotation: { type: 'TSUnionType' },
        } as TSTypeAliasDeclaration)
        .firstNode();

    if (!tsTypeAliasDecl) {
        return false;
    }

    const allStringLiteralMembers = (tsTypeAliasDecl.typeAnnotation as TSUnionType).types.every(
        (t) => j.TSLiteralType.check(t) && j.StringLiteral.check(t.literal)
    );
    return allStringLiteralMembers;
};

codeMod.scope = 'cursor';

codeMod.title = 'Convert type union to string enum';

codeMod.description = '';

codeMod.detail = '';

module.exports = codeMod;
