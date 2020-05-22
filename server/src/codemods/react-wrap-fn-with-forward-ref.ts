import {
    ArrowFunctionExpression,
    AstNode,
    FunctionDeclaration,
    FunctionExpression,
    NodePath,
    VariableDeclaration,
    VariableDeclarator,
} from 'ast-types';
import { JsCodeShift } from 'jscodeshift';

import { CodeModExports } from '../codeModTypes';
import { isReactComponentName } from '../utils/react';

function getVariableDeclaration(
    path: NodePath<AstNode>,
    j: JsCodeShift
): NodePath<VariableDeclaration> | null {
    let checkTarget: NodePath<AstNode> | undefined;
    if (j.Identifier.check(path.node) && j.VariableDeclarator.check(path.parent.node)) {
        // const fo|o = () => {};
        checkTarget = path.parent.parent;
    } else if (
        j.ArrowFunctionExpression.check(path.node) ||
        j.FunctionExpression.check(path.node)
    ) {
        // const Foo = () =|> {};
        // const Foo = functi|on() {};
        checkTarget = path.parent.parent;
    } else if (j.VariableDeclarator.check(path.node)) {
        // const Foo |= () => {};
        checkTarget = path.parent;
    } else if (j.VariableDeclaration.check(path.node)) {
        // co|nst Foo = () => {};
        checkTarget = path;
    } else {
        const typeAnnotation = j(path).thisOrClosest(j.TSTypeAnnotation).firstPath();
        // annotation => identifier => declarator => declaration
        if (typeAnnotation) {
            checkTarget = typeAnnotation.parent?.parent?.parent;
        }
    }
    if (!checkTarget) {
        return null;
    }

    const isDeclarationWithSingleDeclarator =
        j.VariableDeclaration.check(checkTarget.node) && checkTarget.node.declarations.length === 1;
    if (!isDeclarationWithSingleDeclarator) {
        return null;
    }

    const declarator = (checkTarget.node as VariableDeclaration).declarations[0];
    const preconditionsMet =
        j.VariableDeclarator.check(declarator) &&
        isReactComponentName(declarator.id) &&
        (j.ArrowFunctionExpression.check(declarator.init) ||
            j.FunctionExpression.check(declarator.init));
    if (!preconditionsMet) {
        return null;
    }
    return checkTarget as any;
}

function getFunctionDeclaration(
    path: NodePath<AstNode>,
    j: JsCodeShift
): NodePath<FunctionDeclaration> | null {
    if (isReactComponentName(path.node) && j.FunctionDeclaration.check(path.parent.node)) {
        // function Fo|o() {};
        return path.parent as any;
    } else if (j.FunctionDeclaration.check(path.node) && isReactComponentName(path.node.id)) {
        // funct|ion Foo() {};
        return path as any;
    }
    return null;
}

const codeMod: CodeModExports = ((fileInfo, api, options) => {
    const j = api.jscodeshift;
    const ast = fileInfo.ast;
    const target = options.target;
    const path = target.firstPath()!;

    let functionDeclaration = getFunctionDeclaration(path, j);
    let variableDeclaration = getVariableDeclaration(path, j);

    function createUseCallbackWrapper(fnExpr: ArrowFunctionExpression | FunctionExpression) {
        return j.memberExpression(
            j.identifier('React'),
            j.callExpression(j.identifier('forwardRef'), [fnExpr])
        );
    }

    if (functionDeclaration) {
        const oldFuncExpr = functionDeclaration.node;
        // Replace function onClick() {} WITH const onClick = useCallback(() => {}, []);
        let oldPropsAnnotation;
        // prepare new function props
        let propsParam;
        if (oldFuncExpr.params.length > 0) {
            const firstParam = oldFuncExpr.params[0];
            if (j.Identifier.check(firstParam) || j.ObjectPattern.check(firstParam)) {
                oldPropsAnnotation = firstParam.typeAnnotation;
                firstParam.typeAnnotation = null;
                propsParam = firstParam;
            }
        }
        if (!propsParam) {
            propsParam = j.identifier('props');
        }
        const newParams = [propsParam, j.identifier('ref')];

        const newFuncExpr = j.arrowFunctionExpression(newParams, oldFuncExpr.body);
        const newNode = j.variableDeclaration('const', [
            j.variableDeclarator(
                j.identifier(oldFuncExpr.id.name),
                createUseCallbackWrapper(newFuncExpr)
            ),
        ]);
        newNode.comments = oldFuncExpr.comments;
        functionDeclaration.replace(newNode);
    } else if (variableDeclaration) {
        const variableDeclarator = variableDeclaration.node.declarations[0] as VariableDeclarator;
        // Replace const onClick = () => {} WITH const onClick = useCallback(() => {}, []);
        const functionExpr = variableDeclarator.init as
            | ArrowFunctionExpression
            | FunctionExpression;
        variableDeclarator.init = createUseCallbackWrapper(functionExpr);
    }

    const resultText = ast.toSource();
    return resultText;
}) as CodeModExports;

codeMod.canRun = (fileInfo, api, options) => {
    const j = api.jscodeshift;
    const target = options.target;
    const path = target.firstPath();

    if (!path) {
        return false;
    }

    return Boolean(getFunctionDeclaration(path, j) || getVariableDeclaration(path, j));
};

codeMod.scope = 'cursor';

codeMod.title = 'Wrap component into React.forwardRef()';

codeMod.description = '';

codeMod.detail = '';

module.exports = codeMod;
