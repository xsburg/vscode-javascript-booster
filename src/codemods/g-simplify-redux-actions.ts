import {
    ArrayExpression,
    ArrowFunctionExpression,
    BlockStatement,
    CallExpression,
    Expression,
    File,
    FunctionDeclaration,
    Identifier,
    IfStatement,
    Node,
    NodePath,
    ObjectExpression,
    ObjectPattern,
    ObjectProperty,
    Printable,
    ReturnStatement,
    StringLiteral,
    TSTypeAnnotation,
    TypeAnnotation,
    UnaryExpression
} from 'ast-types';
import { Collection, JsCodeShift } from 'jscodeshift';
import * as _ from 'lodash';
import { CodeModExports } from '../models/CodeMod';
import logService from '../services/logService';

let j: JsCodeShift;
let ast: Collection<File>;
let constActionCreators: Identifier[];
let asyncActionCreators: Identifier[];

const codeMod: CodeModExports = (fileInfo, api, options) => {
    j = api.jscodeshift;
    ast = fileInfo.ast;
    constActionCreators = [];
    asyncActionCreators = [];

    const $functionDeclarations = ast.find(j.FunctionDeclaration, { id: { type: 'Identifier' } });
    $functionDeclarations.forEach(path => {
        try {
            if (transformConstAction(path)) {
                return;
            }
        } catch (e) {
            // tslint:disable-next-line:no-debugger
            debugger;
            logService.outputError(`While transforming Const ${fileInfo.path}:`);
            logService.outputError(e.toString());
            return;
        }

        try {
            if (transformAsyncAction(path)) {
                return;
            }
        } catch (e) {
            // tslint:disable-next-line:no-debugger
            debugger;
            logService.outputError(`While transforming Async ${fileInfo.path}:`);
            logService.outputError(e.toString());
            return;
        }
    });

    // add actions const
    const constDeclarator = ast.find(j.VariableDeclarator, { id: { name: 'constActions' } });
    if (constDeclarator.length === 0) {
        const exportedAction = ast.find(j.ExportNamedDeclaration, {
            declaration: {
                type: 'TSTypeAliasDeclaration',
                id: { name: 'Action' }
            }
        });
        exportedAction.remove();

        const header = j(`
            import { $call } from 'modules/react-types';
            import { createAction, createAsyncAction, getAsyncRequestType, getAsyncResponseType, getAsyncFailureType } from 'modules/react-redux';
        `);
        const footer = j(`
            const constActions = [];
            const asyncActions = [];

            const constActionsData = constActions.map($call);
            const asyncActionRequests = asyncActions.map(getAsyncRequestType);
            const asyncActionResponses = asyncActions.map(getAsyncResponseType);
            const asyncActionFailures = asyncActions.map(getAsyncFailureType);
            export type Action =
                | typeof constActionsData[number]
                | typeof asyncActionRequests[number]
                | typeof asyncActionResponses[number]
                | typeof asyncActionFailures[number];`);
        const statements = footer.firstNode<File>()!.program.body;
        const programStatements = ast.firstNode<File>()!.program.body;
        let headerComment;
        if (programStatements[0].comments) {
            headerComment = programStatements[0].comments![0];
            programStatements[0].comments!.splice(0, 1);
        }
        programStatements.push(...statements);
        programStatements.unshift(...header.firstNode<File>()!.program.body);
        if (headerComment) {
            if (j.CommentBlock.check(headerComment)) {
                programStatements[0].comments = [j.commentBlock(headerComment.value, true)];
            }
        }
    }

    const constArrayElements = (ast
        .find(j.VariableDeclarator, { id: { name: 'constActions' } })
        .firstNode()!.init as ArrayExpression).elements;
    const asyncArrayElements = (ast
        .find(j.VariableDeclarator, { id: { name: 'asyncActions' } })
        .firstNode()!.init as ArrayExpression).elements;

    function addMissingIds(arrayElements: Identifier[], creatorIdentifiers: Identifier[]) {
        const newElements = creatorIdentifiers.filter(
            y => !arrayElements.some(x => x.name === y.name)
        );
        arrayElements.push(...newElements);
    }

    addMissingIds(constArrayElements as Identifier[], constActionCreators);
    addMissingIds(asyncArrayElements as Identifier[], asyncActionCreators);

    const resultText = ast.toSource();
    return resultText;
};

function findInterface(name: string) {
    return ast.find(j.TSInterfaceDeclaration, {
        id: { name }
    });
}

function findConst(name: string) {
    return ast.find(j.VariableDeclarator, { id: { name } });
}

function removeNode($node: Collection<any>) {
    const $exportStmt = $node.closest(j.ExportNamedDeclaration);
    if ($exportStmt.length > 0) {
        $exportStmt.remove();
    } else {
        $node.remove();
    }
}

function transformConstAction(path: NodePath<FunctionDeclaration>) {
    const actionFnName = path.node.id.name;
    const actionInterfaceName = `${_.upperFirst(actionFnName)}Action`;
    const actionConstantName = _.toUpper(_.snakeCase(actionFnName));

    const $actionFn = ast.find(j.FunctionDeclaration, { id: { name: actionFnName } });
    const $interface = findInterface(actionInterfaceName);
    const $const = findConst(actionConstantName);
    if ($interface.length === 0 || $const.length === 0) {
        return;
    }

    const actionFnNode = $actionFn.firstNode()!;
    const bodyStatements = (actionFnNode.body as BlockStatement).body;
    const lastStatement = bodyStatements[bodyStatements.length - 1];
    if (
        !j.match<ReturnStatement>(lastStatement, {
            argument: {
                type: 'ObjectExpression'
            } as any
        })
    ) {
        return;
    }

    const objectProperties = (((lastStatement as ReturnStatement).argument as ObjectExpression)
        .properties as ObjectProperty[]).filter(p => (p.key as Identifier).name !== 'type');

    const params = actionFnNode.params;
    // if (params.length === 1 && j.ObjectPattern.check(params[0])) {
    //     const optionsId = j.identifier('options');
    //     optionsId.typeAnnotation = (params[0] as ObjectPattern).typeAnnotation;
    //     params = [optionsId];
    //     /* objectProperties.forEach(prop => {
    //         if (j.Identifier.check(prop.value)) {
    //             prop.value = j.memberExpression(j.identifier('options'), prop.value);
    //             (prop as any).shorthand = false;
    //         }
    //     }); */
    // }

    let creatorBody;
    if (bodyStatements.length > 1) {
        creatorBody = j.blockStatement([
            ...bodyStatements.slice(0, -1),
            j.returnStatement(
                j.callExpression(j.identifier('createAction'), [
                    j.identifier(actionConstantName),
                    j.objectExpression(objectProperties)
                ])
            )
        ]);
    } else {
        creatorBody = j.callExpression(j.identifier('createAction'), [
            j.identifier(actionConstantName),
            j.objectExpression(objectProperties)
        ]);
    }

    const replacement = j.variableDeclaration('const', [
        j.variableDeclarator(
            j.identifier(actionFnName),
            j.arrowFunctionExpression(params, creatorBody)
        )
    ]);
    removeNode($interface);
    $actionFn.replaceWith(replacement);
    constActionCreators.push(id(actionFnName));
    return true;
}

function id(name: string, typeAnnotation?: TSTypeAnnotation) {
    const result = j.identifier(name);
    if (typeAnnotation) {
        result.typeAnnotation = typeAnnotation as any;
    }
    return result;
}

function op(name: string) {
    const result = j.objectProperty(j.identifier(name), j.identifier(name));
    (result as any).shorthand = true;
    return result;
}

function transformAsyncAction(path: NodePath<FunctionDeclaration>) {
    const actionFnName = path.node.id.name;
    const interfaceRequestName = `${_.upperFirst(actionFnName)}RequestAction`;
    const interfaceResponseName = `${_.upperFirst(actionFnName)}ResponseAction`;
    const interfaceFailureName = `${_.upperFirst(actionFnName)}FailureAction`;
    const interfaceRequestDataName = `${_.upperFirst(actionFnName)}RequestData`;
    const interfaceResponseDataName = `${_.upperFirst(actionFnName)}ResponseData`;
    const constRequestName = `${_.toUpper(_.snakeCase(actionFnName))}_REQUEST`;
    const constResponseName = `${_.toUpper(_.snakeCase(actionFnName))}_RESPONSE`;
    const constFailureName = `${_.toUpper(_.snakeCase(actionFnName))}_FAILURE`;

    const $actionFn = ast.find(j.FunctionDeclaration, { id: { name: actionFnName } });
    const $interfaceRequest = findInterface(interfaceRequestName);
    const $interfaceResponse = findInterface(interfaceResponseName);
    const $interfaceFailure = findInterface(interfaceFailureName);
    const $interfaceRequestData = findInterface(interfaceRequestDataName);
    const $interfaceResponseData = findInterface(interfaceResponseDataName);
    const $constRequest = findConst(constRequestName);
    const $constResponse = findConst(constResponseName);
    const $constFailure = findConst(constFailureName);

    if (
        [
            $interfaceRequest,
            $interfaceResponse,
            $interfaceFailure,
            $constRequest,
            $constResponse,
            $constFailure
        ].some(x => x.length === 0)
    ) {
        return;
    }

    const actionFnNode = $actionFn.firstNode()!;
    let bodyStatements = (actionFnNode.body as BlockStatement).body;
    let lastStatement = bodyStatements[bodyStatements.length - 1];
    if (
        j.match<ReturnStatement>(lastStatement, {
            argument: { type: 'ArrowFunctionExpression' } as any
        }) &&
        bodyStatements.length === 1
    ) {
        // thunk transformation
        bodyStatements = ((lastStatement.argument as ArrowFunctionExpression)
            .body as BlockStatement).body;
        if (
            !j.match<ReturnStatement>(bodyStatements[bodyStatements.length - 1], {
                argument: {
                    type: 'CallExpression',
                    callee: {
                        type: 'CallExpression',
                        callee: { type: 'Identifier', name: 'doApiRequest' }
                    }
                } as any
            })
        ) {
            return;
        }
        lastStatement = j.returnStatement(
            ((bodyStatements[bodyStatements.length - 1] as ReturnStatement)
                .argument as CallExpression).callee
        );
    }

    if (
        !j.match<ReturnStatement>(lastStatement, {
            argument: {
                type: 'CallExpression',
                callee: { type: 'Identifier', name: 'doApiRequest' }
            } as any
        })
    ) {
        return;
    }

    let shouldSendRequestFn = null;
    if (bodyStatements.length > 1) {
        shouldSendRequestFn = j.objectProperty(
            id('shouldSendRequest'),
            j.arrowFunctionExpression(
                [id('state'), id('dispatch')],
                j.blockStatement([
                    j.throwStatement(
                        j.newExpression(id('Error'), [j.stringLiteral('PLEASE VALIDATE ME')])
                    ),
                    ...bodyStatements.slice(0, -1)
                ])
            )
        );
    }

    const doApiRequestProps = ((lastStatement.argument as CallExpression)
        .arguments[0] as ObjectExpression).properties as ObjectProperty[];
    const requestFn = doApiRequestProps.find(x => (x.key as Identifier).name === 'requestFn')!;
    const requestFnBody = (requestFn.value as ArrowFunctionExpression).body;
    if (!j.Expression.check(requestFnBody)) {
        throw new Error('requestFn not an expression');
    }

    removeNode($interfaceRequest);
    removeNode($interfaceResponse);
    removeNode($interfaceFailure);
    removeNode($interfaceRequestData);
    // removeNode($interfaceResponseData);

    ($constRequest.firstNode()!.id as Identifier).name = ($constRequest.firstNode()!
        .id as Identifier).name.replace('_REQUEST', '');
    ($constRequest.firstNode()!.init as StringLiteral).value = ($constRequest.firstNode()!
        .init as StringLiteral).value.replace('_REQUEST', '');

    const params = actionFnNode.params;
    // if (params.length === 1 && j.ObjectPattern.check(params[0])) {
    //     const optionsId = j.identifier('options');
    //     optionsId.typeAnnotation = (params[0] as ObjectPattern).typeAnnotation;
    //     params = [optionsId];
    // }

    const data = doApiRequestProps.find(x => (x.key as Identifier).name === 'data')!;
    let requestArrowBody: Expression | BlockStatement;
    if (j.Identifier.check(data.key)) {
        if (j.ArrowFunctionExpression.check(data.value)) {
            if (j.BlockStatement.check(data.value.body)) {
                const $returnStatement = j(data.value.body).find(j.ReturnStatement);
                const retNode = $returnStatement.firstNode()!;
                retNode.argument = j.callExpression(id('createAction'), [
                    $constRequest.firstNode()!.id,
                    retNode.argument!
                ]);
                requestArrowBody = data.value.body;
            } else {
                throw new Error('data() can`t return expression');
            }
        } else if (j.ObjectExpression.check(data.value)) {
            requestArrowBody = j.callExpression(id('createAction'), [
                $constRequest.firstNode()!.id,
                data.value
            ]);
        } else {
            throw new Error('data() can`t be an object method');
        }
    } else {
        throw new Error('`data` not a key');
    }

    let promiseResolveCallExpression = j.callExpression(
        j.memberExpression(id('Promise'), id('resolve')),
        [requestFnBody]
    );
    const parseFn = doApiRequestProps.find(x => (x.key as Identifier).name === 'parseFn');
    if (parseFn) {
        const extraThenExpr = parseFn.value;
        promiseResolveCallExpression = j.callExpression(
            j.memberExpression(promiseResolveCallExpression, id('then')),
            [extraThenExpr]
        );
    }

    const schema = doApiRequestProps.find(x => (x.key as Identifier).name === 'schema');

    const createAsyncActionProps = [
        j.objectProperty(
            j.identifier('request'),
            j.arrowFunctionExpression(
                [
                    id(
                        'state',
                        j.tsTypeAnnotation({
                            type: 'TSTypeReference',
                            typeName: id('State')
                        } as any)
                    )
                ],
                requestArrowBody,
                Boolean(j.Expression.check(requestArrowBody))
            )
        ),
        j.objectProperty(
            id('response'),
            j.arrowFunctionExpression(
                [id('request')],
                // .then()
                j.callExpression(
                    // Promise.resolve(requestFn).then
                    j.memberExpression(promiseResolveCallExpression, id('then')),
                    [
                        // response => createAction (parser here)
                        j.arrowFunctionExpression(
                            [id('response', j.tsTypeAnnotation(j.tsAnyKeyword()))],
                            j.callExpression(id('createAction'), [
                                $constResponse.firstNode()!.id,
                                j.objectExpression(
                                    [
                                        op('request'),
                                        schema
                                            ? j.objectProperty(id('raw'), id('response'))
                                            : (null as any),
                                        j.objectProperty(
                                            id('TODO'),
                                            j.stringLiteral(
                                                'CHECK that all the necessary properties are passed. Pay particular attention if there`s a `schema`.'
                                            )
                                        )
                                    ].filter(x => x)
                                )
                                // response must be parsed by hand
                            ]),
                            true
                        )
                    ]
                ),
                true
            )
        ),
        j.objectProperty(
            j.identifier('failure'),
            j.arrowFunctionExpression(
                [j.identifier('error')],
                j.callExpression(j.identifier('createAction'), [
                    $constFailure.firstNode()!.id,
                    j.objectExpression([])
                ]),
                true
            )
        )
    ];

    if (shouldSendRequestFn) {
        createAsyncActionProps.unshift(shouldSendRequestFn);
    }

    if (schema) {
        createAsyncActionProps.push(
            j.objectProperty(
                schema.key,
                j.objectExpression([j.objectProperty(id('raw'), schema.value)])
            )
        );
    }

    const responseFn = doApiRequestProps.find(x => (x.key as Identifier).name === 'responseFn');
    if (responseFn) {
        const responseFnBody = (responseFn.value as ArrowFunctionExpression).body;
        createAsyncActionProps.push(
            j.objectProperty(
                id('willDispatchResponse'),
                j.arrowFunctionExpression([], responseFnBody)
            )
        );
    }

    const afterResponseFn = doApiRequestProps.find(
        x => (x.key as Identifier).name === 'afterResponseFn'
    );
    if (afterResponseFn) {
        const afterResponseFnBody = (afterResponseFn.value as ArrowFunctionExpression).body;
        createAsyncActionProps.push(
            j.objectProperty(
                id('didDispatchResponse'),
                j.arrowFunctionExpression(
                    [id('response'), id('request'), id('state'), id('dispatch')],
                    afterResponseFnBody
                )
            )
        );
    }

    const errorFn = doApiRequestProps.find(x => (x.key as Identifier).name === 'errorFn');
    if (errorFn) {
        const errorFnBody = (errorFn.value as ArrowFunctionExpression).body;
        createAsyncActionProps.push(
            j.objectProperty(
                id('willDispatchError'),
                j.arrowFunctionExpression([id('request'), id('error')], errorFnBody)
            )
        );
    }

    const replacement = j.variableDeclaration('const', [
        j.variableDeclarator(
            j.identifier(actionFnName),
            j.arrowFunctionExpression(
                params,
                j.callExpression(j.identifier('createAsyncAction'), [
                    j.objectExpression(createAsyncActionProps)
                ]),
                true
            )
        )
    ]);
    $actionFn.replaceWith(replacement);
    asyncActionCreators.push(id(actionFnName));
    return true;
}

codeMod.scope = 'global';

codeMod.title = 'AM Transform actions';

codeMod.description = '';

codeMod.detail = '';

module.exports = codeMod;
