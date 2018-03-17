import {
    ArrayExpression,
    ArrowFunctionExpression,
    BlockStatement,
    CallExpression,
    Expression,
    File,
    FunctionDeclaration,
    Identifier,
    IfStatement,
    Node,
    NodePath,
    ObjectExpression,
    ObjectPattern,
    ObjectProperty,
    Printable,
    ReturnStatement,
    StringLiteral,
    TSTypeAnnotation,
    TypeAnnotation,
    UnaryExpression
} from 'ast-types';
import { Collection, JsCodeShift } from 'jscodeshift';
import * as _ from 'lodash';
import { CodeModExports } from '../models/CodeMod';
import logService from '../services/logService';

let j: JsCodeShift;
let ast: Collection<File>;

const codeMod: CodeModExports = (fileInfo, api, options) => {
    j = api.jscodeshift;
    ast = fileInfo.ast;

    ast
        .find(j.Identifier, (node: any) => {
            return node.name.endsWith('_REQUEST');
        })
        .forEach(path => {
            path.node.name = path.node.name.replace('_REQUEST', '');
        });

    const actionExpressions = ast.find(j.MemberExpression, {
        object: { name: 'action', type: 'Identifier' }
    });
    actionExpressions.forEach(path => {
        if (
            j.Identifier.check(path.node.property) &&
            ['type', 'payload', 'meta', 'entities'].includes(path.node.property.name)
        ) {
            return;
        }
        path.node.object = j.memberExpression(id('action'), id('payload'));
    });

    const resultText = ast.toSource();
    return resultText;
};

function id(name: string, typeAnnotation?: TSTypeAnnotation) {
    const result = j.identifier(name);
    if (typeAnnotation) {
        result.typeAnnotation = typeAnnotation as any;
    }
    return result;
}

codeMod.scope = 'global';

codeMod.title = 'AM Fix reducer actions';

codeMod.description = '';

codeMod.detail = '';

module.exports = codeMod;
