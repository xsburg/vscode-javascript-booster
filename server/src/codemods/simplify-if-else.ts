import {
    AssignmentExpression,
    BlockStatement,
    BooleanLiteral,
    ExpressionStatement,
    Identifier,
    Node,
    ReturnStatement,
    Statement
} from 'ast-types';
import { JsCodeShift } from 'jscodeshift';
import { CodeModExports } from '../codeModTypes';
import { getNextStatementInBlock, getSingleStatement } from '../utils/astHelpers';

function checkStatementIsBooleanReturn(j: JsCodeShift, statement: Statement | null | false) {
    return (
        statement &&
        j.ReturnStatement.check(statement) &&
        j.BooleanLiteral.check(statement.argument)
    );
}

function getBooleanReturnValue(j: JsCodeShift, statement: Statement) {
    return ((statement as ReturnStatement).argument as BooleanLiteral).value;
}

const codeMod: CodeModExports = ((fileInfo, api, options) => {
    const j = api.jscodeshift;
    const ast = fileInfo.ast;
    const target = options.target;
    const path = target.thisOrClosest(j.IfStatement).firstPath()!;

    if (j.BooleanLiteral.check(path.node.test)) {
        // Case 1. Simplify if(true), if(false)
        const testValue = path.node.test.value;

        let statements: Statement[];
        if (testValue) {
            // Inline con branch
            if (j.BlockStatement.check(path.node.consequent)) {
                statements = path.node.consequent.body;
            } else {
                statements = [path.node.consequent];
            }
        } else {
            // Inline alt branch
            if (j.BlockStatement.check(path.node.alternate)) {
                statements = path.node.alternate.body;
            } else if (path.node.alternate) {
                statements = [path.node.alternate];
            } else {
                statements = [];
            }
        }

        statements.reverse().forEach(st => path.insertAfter(st));
        path.prune();
    } else {
        // Case 2. if-return-bool-else-return-bool
        const conStatement = getSingleStatement(j, path.node.consequent)!;
        const altStatement = getSingleStatement(j, path.node.alternate);
        const nextStatement = getNextStatementInBlock(j, path);

        const conValue = getBooleanReturnValue(j, conStatement);
        let altValue;
        if (altStatement) {
            altValue = getBooleanReturnValue(j, altStatement);
        } else {
            altValue = getBooleanReturnValue(j, nextStatement!);
            const blockBody = (path.parent.node as BlockStatement).body;
            blockBody.splice(blockBody.indexOf(nextStatement!), 1);
        }

        let replacement;
        if (conValue) {
            if (altValue) {
                // return true;
                replacement = j.booleanLiteral(true);
            } else {
                // return !!test;
                replacement = j.unaryExpression('!', j.unaryExpression('!', path.node.test));
            }
        } else {
            if (altValue) {
                // return !test;
                replacement = j.unaryExpression('!', path.node.test);
            } else {
                // return false;
                replacement = j.booleanLiteral(false);
            }
        }

        path.replace(j.returnStatement(replacement));
    }

    const resultText = ast.toSource();
    return resultText;
}) as CodeModExports;

codeMod.canRun = (fileInfo, api, options) => {
    const j = api.jscodeshift;
    const target = options.target;
    const path = target.thisOrClosest(j.IfStatement).firstPath();

    if (!path) {
        return false;
    }

    const constantTest =
        j.BooleanLiteral.check(path.node.test) && j.BlockStatement.check(path.parent.node);

    const conStatement = getSingleStatement(j, path.node.consequent);
    const altStatement = getSingleStatement(j, path.node.alternate);
    const nextStatement = !altStatement && getNextStatementInBlock(j, path);
    const trivialReturnInBothBranches =
        checkStatementIsBooleanReturn(j, conStatement) &&
        (checkStatementIsBooleanReturn(j, altStatement) ||
            checkStatementIsBooleanReturn(j, nextStatement));

    return Boolean(constantTest || trivialReturnInBothBranches);
};

codeMod.scope = 'cursor';

codeMod.title = 'Simplify if-else';

codeMod.description = '';

codeMod.detail = '';

module.exports = codeMod;
