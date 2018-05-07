import {
    Expression,
    FunctionDeclaration,
    IfStatement,
    Printable,
    UnaryExpression
} from 'ast-types';
import { Collection, JsCodeShift } from 'jscodeshift';
import { CodeModExports } from '../models/CodeMod';
import { negateExpression } from '../utils/astHelpers';

const codeMod: CodeModExports = (fileInfo, api, options) => {
    const j = api.jscodeshift;
    const ast = fileInfo.ast;
    const target = options.target;

    const node = target.firstNode<IfStatement>()!;

    const consequent = node.consequent;
    let alternate;
    if (node.alternate) {
        alternate = node.alternate;
    } else {
        alternate = j.blockStatement([j.debuggerStatement()]);
    }

    node.consequent = alternate;
    node.alternate = consequent;
    node.test = negateExpression(j, node.test);

    const resultText = ast.toSource();
    return resultText;
};

codeMod.canRun = (fileInfo, api, options) => {
    const j = api.jscodeshift;
    const ast = fileInfo.ast;
    const target = options.target;
    const node = target.firstNode<IfStatement>();

    return j.IfStatement.check(node);
};

codeMod.scope = 'cursor';

codeMod.title = 'Flip if-else';

codeMod.description = '';

codeMod.detail = '';

module.exports = codeMod;
