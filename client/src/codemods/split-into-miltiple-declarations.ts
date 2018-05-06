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
    VariableDeclaration
} from 'ast-types';
import { Collection, JsCodeShift } from 'jscodeshift';
import { CodeModExports } from '../models/CodeMod';

const codeMod: CodeModExports = (fileInfo, api, options) => {
    const j = api.jscodeshift;
    const ast = fileInfo.ast;
    const target = options.target;

    const path = target.thisOrClosest(j.VariableDeclaration).firstPath()!;
    const node = path.node;

    const declarations = node.declarations
        .map(d => j.variableDeclaration(node.kind, [d]))
        .reverse();
    declarations.forEach(d => {
        path.insertAfter(d);
    });
    path.prune();

    const resultText = ast.toSource();
    return resultText;
};

codeMod.canRun = (fileInfo, api, options) => {
    const j = api.jscodeshift;
    const ast = fileInfo.ast;
    const target = options.target;
    const path = target.thisOrClosest(j.VariableDeclaration).firstPath();
    return Boolean(path && path.node.declarations.length > 1);
};

codeMod.scope = 'cursor';

codeMod.title = 'Split into multiple declarations';

codeMod.description = '';

codeMod.detail = '';

module.exports = codeMod;
