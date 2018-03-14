import {
    ArrowFunctionExpression,
    BlockStatement,
    Expression,
    FunctionDeclaration,
    Identifier,
    IfStatement,
    ObjectExpression,
    ObjectProperty,
    Printable,
    ReturnStatement,
    UnaryExpression,
    ObjectPattern
} from 'ast-types';
import { Collection, JsCodeShift } from 'jscodeshift';
import * as _ from 'lodash';
import { CodeModExports } from '../models/CodeMod';

const codeMod: CodeModExports = (fileInfo, api, options) => {
    const j = api.jscodeshift;
    const ast = fileInfo.ast;
    // const target = options.target;
    // const path = target.firstPath<Identifier>()!;

    const $functionDeclarations = ast.find(j.FunctionDeclaration, { id: { type: 'Identifier' } });
    $functionDeclarations.forEach(path => {
        try {
            const actionFnName = path.node.id.name;
            const actionInterfaceName = `${_.upperFirst(actionFnName)}Action`;
            const actionConstantName = _.toUpper(_.snakeCase(actionFnName));

            const $actionFn = ast.find(j.FunctionDeclaration, { id: { name: actionFnName } });
            const $interface = ast.find(j.TSInterfaceDeclaration, {
                id: { name: actionInterfaceName }
            });
            const $const = ast.find(j.VariableDeclarator, { id: { name: actionConstantName } });
            if ($interface.length === 0 || $const.length === 0) {
                return;
            }

            const actionFnNode = $actionFn.firstNode()!;
            let objectProperties = ((((actionFnNode.body as BlockStatement)
            .body[0] as ReturnStatement).argument as ObjectExpression)
            .properties as ObjectProperty[]).filter(p => (p.key as Identifier).name !== 'type');
            let params = actionFnNode.params;
            if (params.length === 1 && j.ObjectPattern.check(params[0])) {
                let optionsId = j.identifier('options');
                optionsId.typeAnnotation = (params[0] as ObjectPattern).typeAnnotation;
                params = [
                    optionsId
                ];
                objectProperties.forEach(op => {
                    if (j.Identifier.check(op.value)) {
                        op.value = j.memberExpression(j.identifier('options'), op.value)
                    }
                });
            } else {
            }

            const replacement = j.variableDeclaration('const', [
                j.variableDeclarator(
                    j.identifier(actionFnName),
                    j.arrowFunctionExpression(
                        params,
                        j.callExpression(j.identifier('createAction'), [
                            j.identifier(actionConstantName),
                            j.objectExpression(objectProperties)
                        ]),
                        true
                    )
                )
            ]);
            const $exportInterface = $interface.closest(j.ExportNamedDeclaration);
            if ($exportInterface.length > 0) {
                $exportInterface.remove();
            } else {
                $interface.remove();
            }
            $actionFn.replaceWith(replacement);
        } catch (e) {
            debugger;
        }
    });

    const resultText = ast.toSource();
    return resultText;
};

codeMod.scope = 'global';

codeMod.title = 'AM Transform actions';

codeMod.description = '';

codeMod.detail = '';

module.exports = codeMod;
