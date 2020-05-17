import {
    ConditionalExpression,
    Expression,
    FunctionDeclaration,
    Printable,
    UnaryExpression,
} from 'ast-types';
import { Collection, JsCodeShift } from 'jscodeshift';

import { CodeModExports } from '../codeModTypes';
import { negateExpression } from '../utils/astHelpers';

const codeMod: CodeModExports = ((fileInfo, api, options) => {
    const j = api.jscodeshift;
    const ast = fileInfo.ast;
    const target = options.target;

    const path = target.thisOrClosest(j.ConditionalExpression).firstPath()!;

    if (j.BooleanLiteral.check(path.node.test)) {
        // Case 1. bool ? a : b
        const testValue = path.node.test.value;
        let replacement;
        if (testValue) {
            replacement = path.node.consequent;
        } else {
            replacement = path.node.alternate;
        }
        path.replace(replacement);
    } else if (
        j.BooleanLiteral.check(path.node.consequent) &&
        j.BooleanLiteral.check(path.node.alternate)
    ) {
        // case 2. foo ? bool1 : bool2
        const conValue = path.node.consequent.value;
        const altValue = path.node.alternate.value;

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

        path.replace(replacement);
    } else {
        // Case 3. a ? a : b => a || b
        const replacement = j.logicalExpression('||', path.node.test, path.node.alternate);
        path.replace(replacement);
    }

    const resultText = ast.toSource();
    return resultText;
}) as CodeModExports;

codeMod.canRun = (fileInfo, api, options) => {
    const j = api.jscodeshift;
    const ast = fileInfo.ast;
    const target = options.target;
    const node = target.thisOrClosest(j.ConditionalExpression).firstNode();

    if (!j.ConditionalExpression.check(node)) {
        return false;
    }

    // true ? a : b
    const constantTest = j.BooleanLiteral.check(node.test);

    // foo ? true : false
    const booleanBranches =
        j.BooleanLiteral.check(node.consequent) && j.BooleanLiteral.check(node.alternate);

    // a ? a : b
    const testStr = fileInfo.source.substring(node.test.start, node.test.end).trim();
    const conStr = fileInfo.source.substring(node.consequent.start, node.consequent.end).trim();
    const sameTestCon = testStr === conStr;

    return constantTest || booleanBranches || sameTestCon;
};

codeMod.scope = 'cursor';

codeMod.title = 'Simplify ?:';

codeMod.description = '';

codeMod.detail = '';

module.exports = codeMod;
