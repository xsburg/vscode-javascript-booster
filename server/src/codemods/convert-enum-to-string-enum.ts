import { AstNode, NodePath, StringLiteral, TSEnumDeclaration } from 'ast-types';
import { JsCodeShift } from 'jscodeshift';
import * as _ from 'lodash';

import { CodeModExports } from '../codeModTypes';
import { assertNever } from '../utils/helpers';

function getEnumDeclaration(path: NodePath<AstNode> | null, j: JsCodeShift) {
    let enumDeclaration: TSEnumDeclaration | null = null;
    if (path) {
        if (j.TSEnumDeclaration.check(path.node)) {
            enumDeclaration = path.node;
        } else if (j.Identifier.check(path.node) && j.TSEnumDeclaration.check(path.parent.node)) {
            enumDeclaration = path.parent.node;
        }
    }
    return enumDeclaration;
}

enum EnumValueCase {
    AsIs,
    CamelCase,
    KebabCase,
    SnakeCase,
}

function inferValueCase(enumDecl: TSEnumDeclaration) {
    const member = enumDecl.members.find((m) => m.initializer);
    if (!member) {
        return EnumValueCase.AsIs;
    }
    const memberValue = (member.initializer as StringLiteral).value;
    if (_.camelCase(memberValue) === memberValue) {
        return EnumValueCase.CamelCase;
    } else if (_.kebabCase(memberValue) === memberValue) {
        return EnumValueCase.KebabCase;
    } else if (_.snakeCase(memberValue) === memberValue) {
        return EnumValueCase.SnakeCase;
    }
    return EnumValueCase.AsIs;
}

function getEnumValue(value: string, valueCase: EnumValueCase) {
    switch (valueCase) {
        case EnumValueCase.AsIs:
            return value;
        case EnumValueCase.CamelCase:
            return _.camelCase(value);
        case EnumValueCase.KebabCase:
            return _.kebabCase(value);
        case EnumValueCase.SnakeCase:
            return _.snakeCase(value);
        default:
            throw assertNever(valueCase);
    }
}

const codeMod: CodeModExports = ((fileInfo, api, options) => {
    const j = api.jscodeshift;
    const ast = fileInfo.ast;
    const target = options.target;
    const path = target.firstPath();

    const enumDeclaration = getEnumDeclaration(path, j)!;
    const valueCase = inferValueCase(enumDeclaration);

    for (let member of enumDeclaration.members) {
        if (!member.initializer) {
            let value: string;
            if (j.StringLiteral.check(member.id)) {
                value = member.id.value;
            } else {
                value = member.id.name;
            }
            member.initializer = j.stringLiteral(getEnumValue(value, valueCase));
        }
    }

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
    let foundEmptyInitializer = false;
    for (let member of enumDeclaration.members) {
        if (member.initializer && member.initializer.type !== 'StringLiteral') {
            return false;
        }
        if (!member.initializer) {
            foundEmptyInitializer = true;
        }
    }
    return foundEmptyInitializer;
};

codeMod.scope = 'cursor';

codeMod.languageScope = ['typescript', 'typescriptreact'];

codeMod.title = 'Convert to string enum';

codeMod.description = '';

codeMod.detail = '';

module.exports = codeMod;
