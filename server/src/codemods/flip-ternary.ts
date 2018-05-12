import {
    ConditionalExpression,
    Expression,
    FunctionDeclaration,
    Printable,
    UnaryExpression
} from 'ast-types';
import { Collection, JsCodeShift } from 'jscodeshift';
import { CodeModExports } from '../codeModTypes';
import { negateExpression } from '../utils/astHelpers';

const codeMod: CodeModExports = (fileInfo, api, options) => {
    const j = api.jscodeshift;
    const ast = fileInfo.ast;
    const target = options.target;

    const node = target.firstNode<ConditionalExpression>()!;

    const consequent = node.consequent;
    const alternate = node.alternate;

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
    const node = target.firstNode<ConditionalExpression>();

    return j.ConditionalExpression.check(node);
};

codeMod.scope = 'cursor';

codeMod.title = 'Flip ?:';

codeMod.description = '';

codeMod.detail = '';

module.exports = codeMod;
