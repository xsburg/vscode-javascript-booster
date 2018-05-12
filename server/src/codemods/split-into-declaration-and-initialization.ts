import {
    AstNode,
    BinaryExpression,
    Expression,
    ExpressionStatement,
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
import { CodeModExports } from '../codeModTypes';

const codeMod: CodeModExports = (fileInfo, api, options) => {
    const j = api.jscodeshift;
    const ast = fileInfo.ast;
    const target = options.target;

    const path = target.thisOrClosest(j.VariableDeclaration).firstPath()!;

    if (path.node.kind === 'const') {
        path.node.kind = 'let';
    }

    const assignments: ExpressionStatement[] = [];
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

    let testPath = target.firstPath();
    while (testPath && testPath.parent) {
        if (
            j.VariableDeclarator.check(testPath.parent.node) &&
            testPath.parent.node.init === testPath.node
        ) {
            // if path is the node responsible for initialization => target is inside initializer
            return false;
        }
        testPath = testPath.parent;
    }

    const path = target.thisOrClosest(j.VariableDeclaration).firstPath();
    return Boolean(
        path &&
            !j.ExportNamedDeclaration.check(path.parent.node) &&
            path.node.declarations.some(d => Boolean(j.VariableDeclarator.check(d) && d.init))
    );
};

codeMod.scope = 'cursor';

codeMod.title = 'Split into declaration and initialization';

codeMod.description = '';

codeMod.detail = '';

module.exports = codeMod;
