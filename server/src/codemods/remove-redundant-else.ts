import {
    Expression,
    FunctionDeclaration,
    IfStatement,
    Printable,
    UnaryExpression
} from 'ast-types';
import { Collection, JsCodeShift } from 'jscodeshift';
import { CodeModExports } from '../codeModTypes';

const codeMod: CodeModExports = ((fileInfo, api, options) => {
    const j = api.jscodeshift;
    const ast = fileInfo.ast;
    const target = options.target;

    const path = target.firstPath<IfStatement>()!;

    // Move the statements inside the 'else' block below the if-else statement
    let alternateStatements;
    if (j.BlockStatement.check(path.node.alternate)) {
        alternateStatements = path.node.alternate.body;
    } else if (path.node.alternate) {
        alternateStatements = [path.node.alternate];
    }
    if (alternateStatements) {
        alternateStatements
            .slice(0)
            .reverse()
            .forEach(st => path.insertAfter(st));
    }

    path.node.alternate = null;

    const resultText = ast.toSource();
    return resultText;
}) as CodeModExports;

codeMod.canRun = (fileInfo, api, options) => {
    const j = api.jscodeshift;
    const ast = fileInfo.ast;
    const target = options.target;
    const node = target.firstNode();

    if (!j.IfStatement.check(node) || !node.alternate) {
        return false;
    }

    const emptyElse = j.BlockStatement.check(node.alternate) && node.alternate.body.length === 0;
    if (emptyElse) {
        return true;
    }

    return (
        j.ReturnStatement.check(node.consequent) ||
        (j.BlockStatement.check(node.consequent) &&
            node.consequent.body.length > 0 &&
            j.ReturnStatement.check(node.consequent.body[node.consequent.body.length - 1]))
    );
};

codeMod.scope = 'cursor';

codeMod.title = 'Remove redundant else';

codeMod.description = '';

codeMod.detail = '';

module.exports = codeMod;
