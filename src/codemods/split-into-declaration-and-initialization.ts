import {
    AstNode,
    BinaryExpression,
    Expression,
    FunctionDeclaration,
    IfStatement,
    Node,
    Printable,
    TemplateElement,
    UnaryExpression,
    VariableDeclaration,
    VariableDeclarator
} from 'ast-types';
import { Collection, JsCodeShift } from 'jscodeshift';
import { CodeModExports } from '../models/CodeMod';

const codeMod: CodeModExports = (fileInfo, api, options) => {
    const j = api.jscodeshift;
    const ast = fileInfo.ast;
    const target = options.target;

    const path = target.thisOrClosest(j.VariableDeclaration).firstPath()!;

    const assignments = [];
    path.node.declarations.forEach(d => {
        if (j.VariableDeclarator.check(d) && d.init) {
            assignments.push(j.expressionStatement(j.assignmentExpression('=', d.id, d.init)));
            d.init = null;
        }
    });

    assignments.reverse().forEach(a => {
        path.insertAfter(a);
    });

    const resultText = ast.toSource();
    return resultText;
};

codeMod.canRun = (fileInfo, api, options) => {
    const j = api.jscodeshift;
    const ast = fileInfo.ast;
    const target = options.target;
    const path = target.thisOrClosest(j.VariableDeclaration).firstPath();

    return (
        path &&
        path.node.kind !== 'const' &&
        path.node.declarations.some(d => Boolean(j.VariableDeclarator.check(d) && d.init))
    );
};

codeMod.scope = 'cursor';

codeMod.title = 'Split into declaration and initialization';

codeMod.description = '';

codeMod.detail = '';

module.exports = codeMod;
