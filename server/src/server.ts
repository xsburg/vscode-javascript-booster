import {
    Command,
    CompletionItem,
    CompletionItemKind,
    createConnection,
    Diagnostic,
    DiagnosticSeverity,
    IConnection,
    InitializeResult,
    IPCMessageReader,
    IPCMessageWriter,
    NotificationType,
    RequestType,
    TextDocument,
    TextDocumentPositionParams,
    TextDocuments
} from 'vscode-languageserver';
import * as vscode from 'vscode-languageserver-types';
import { commandIds } from './const';
import { CodeModDefinition } from './models/CodeMod';
import astService, { LanguageId } from './services/astService';
import codeModService from './services/codeModService';
import codeService from './services/codeService';
import logService from './services/logService';

let connection: IConnection = createConnection(
    new IPCMessageReader(process),
    new IPCMessageWriter(process)
);

codeService.initialize(connection);

let documents: TextDocuments = new TextDocuments();
documents.listen(connection);

connection.onInitialize((_params): InitializeResult => {
    return {
        capabilities: {
            textDocumentSync: documents.syncKind,
            // codeActionProvider: true,
            executeCommandProvider: {
                commands: [
                    /* commandIds.runCodeMod */
                ]
            }
        }
    };
});

documents.onDidChangeContent(change => {
    validateTextDocument(change.document);
});

interface JavaScriptBoosterSettings {
    codemodDir: string;
}

let settings: JavaScriptBoosterSettings;
connection.onDidChangeConfiguration(change => {
    settings = change.settings.javascriptBooster as JavaScriptBoosterSettings;
    documents.all().forEach(validateTextDocument);
});

function validateTextDocument(textDocument: TextDocument): void {}

/* interface AllFixesParams {
    // textDocument: TextDocumentIdentifier;
    isOnSave: boolean;
}

interface AllFixesResult {
    documentVersion: number;
    foo: string;
}

namespace AllFixesRequest {
    export const type = new server.RequestType<AllFixesParams, AllFixesResult, void, void>(
        'textDocument/tslint/allFixes'
    );
}

connection.onRequest(AllFixesRequest.type, async params => {
    return {
        documentVersion: 1,
        foo: 'bar'
    };
}); */
// connection.sendRequest

interface CodeActionsParams {
    textDocumentUri: string;
    selection: {
        anchor: vscode.Position;
        active: vscode.Position;
    };
}

interface CodeActionsResult {
    textDocument: vscode.VersionedTextDocumentIdentifier;
    codeMods: Array<{
        id: string;
        title: string;
        tooltip?: string;
    }>;
}

export const codeActionsRequestType = new RequestType<
    CodeActionsParams,
    CodeActionsResult,
    void,
    void
>('javascriptBooster/codeActions');

connection.onRequest(codeActionsRequestType, async (params): Promise<CodeActionsResult> => {
    let result: CodeActionsResult;

    const document = documents.get(params.textDocumentUri);
    const source = document.getText();
    const codeMods = await codeModService.getCodeActionMods({
        languageId: document.languageId as LanguageId,
        fileName: document.uri,
        source,
        selection: {
            anchor: astService.offsetAt(source, params.selection.anchor),
            active: astService.offsetAt(source, params.selection.active)
        }
    });

    result = {
        textDocument: {
            uri: document.uri,
            version: document.version
        },
        codeMods: codeMods.map(mod => ({
            id: mod.id,
            title: mod.name,
            tooltip: mod.detail || mod.description
        }))
    };
    return result;
});

interface ProduceTransformationParams {
    codeModId: string;
    textDocumentIdentifier: vscode.VersionedTextDocumentIdentifier;
    selection: {
        anchor: vscode.Position;
        active: vscode.Position;
    };
}

interface ProduceTransformationResult {
    edits: {
        range: { start: vscode.Position; end: vscode.Position };
        newText: string;
    } | null;
}

export const produceTransformationRequestType = new RequestType<
    ProduceTransformationParams,
    ProduceTransformationResult,
    void,
    void
>('javascriptBooster/produceTransformation');

connection.onRequest(produceTransformationRequestType, async params => {
    const { selection, codeModId, textDocumentIdentifier } = params;
    let result: ProduceTransformationResult = {
        edits: null
    };

    const document = documents.get(textDocumentIdentifier.uri);
    if (!astService.isSupportedLanguage(document.languageId)) {
        return result;
    }

    const source = document.getText();
    const offsetSelection = {
        anchor: astService.offsetAt(source, selection.anchor),
        active: astService.offsetAt(source, selection.active)
    };

    let transformResult: string;
    try {
        transformResult = codeModService.executeTransform(codeModId, {
            languageId: document.languageId as LanguageId,
            fileName: document.uri,
            source,
            selection: offsetSelection
        });
    } catch (e) {
        logService.outputError(`Error while executing ${codeModId}.transform(): ${e.toString()}`);
        return result;
    }

    if (transformResult === source) {
        return result;
    }

    const { range, replacement } = getReplacementRange(document, source, transformResult);

    result.edits = {
        range,
        newText: replacement
    };
    return result;
});

/* connection.onCodeAction(async params => {
    const document = documents.get(params.textDocument.uri);
    if (!astService.isSupportedLanguage(document.languageId)) {
        return [];
    }

    const source = document.getText();
    // const activeTextEditor = vscode.window.activeTextEditor!;
    const codeMods = await codeModService.getCodeActionMods({
        languageId: document.languageId as LanguageId,
        fileName: document.uri,
        source,
        selection: {
            anchor: astService.offsetAt(source, params.range.start),
            active: astService.offsetAt(source, params.range.end)
            // anchor: astService.offsetAt(source, activeTextEditor.selection.anchor),
            // active: astService.offsetAt(source, activeTextEditor.selection.active)
        }
    });
    return codeMods.map(
        mod =>
            ({
                title: mod.name,
                command: commandIds.runCodeMod,
                arguments: [mod]
            } as Command)
    );
}); */

function getReplacementRange(document: TextDocument, before: string, after: string) {
    let startPosBefore = 0;
    let startPosAfter = 0;
    while (startPosBefore < before.length && startPosAfter < after.length) {
        const cb = before[startPosBefore];
        const ca = after[startPosAfter];
        if (cb === ca) {
            startPosBefore++;
            startPosAfter++;
        } else if (cb === '\r' && before[startPosBefore + 1] === '\n' && ca === '\n') {
            // \n removed after transformation
            startPosBefore++;
        } else if (ca === '\r' && after[startPosAfter + 1] === '\n' && cb === '\n') {
            // \n added after transformation
            startPosAfter++;
        } else {
            break;
        }
    }

    let endPosBefore = before.length;
    let endPosAfter = after.length;
    while (endPosBefore - 1 >= 0 && endPosAfter - 1 >= 0) {
        const cb = before[endPosBefore - 1];
        const ca = after[endPosAfter - 1];
        if (cb === ca) {
            endPosBefore--;
            endPosAfter--;
        } else if (cb === '\r' && before[endPosBefore] === '\n') {
            // \n removed after transformation
            endPosBefore--;
        } else if (ca === '\r' && after[endPosAfter] === '\n') {
            // \n added after transformation
            endPosAfter--;
        } else {
            break;
        }
    }

    const range: vscode.Range = {
        start: document.positionAt(startPosBefore),
        end: document.positionAt(endPosBefore)
    };
    const replacement = after.substring(startPosAfter, endPosAfter);

    return {
        range,
        replacement
    };
}

function runCodeMod(
    codeModId: string,
    textDocument: vscode.VersionedTextDocumentIdentifier,
    selection: {
        anchor: vscode.Position;
        active: vscode.Position;
    }
) {
    const document = documents.get(textDocument.uri);
    if (!astService.isSupportedLanguage(document.languageId)) {
        return;
    }

    const source = document.getText();
    const offsetSelection = {
        anchor: astService.offsetAt(source, selection.anchor),
        active: astService.offsetAt(source, selection.active)
    };

    let result: string;
    try {
        result = codeModService.executeTransform(codeModId, {
            languageId: document.languageId as LanguageId,
            fileName: document.uri,
            source,
            selection: offsetSelection
        });
    } catch (e) {
        logService.outputError(`Error while executing ${codeModId}.transform(): ${e.toString()}`);
        return;
    }

    if (result === source) {
        return;
    }

    const { range, replacement } = getReplacementRange(document, source, result);
    connection.workspace.applyEdit({
        changes: {
            [textDocument.uri]: [
                {
                    range,
                    newText: replacement
                }
            ]
        } /* ,
        documentChanges: [
            {
                textDocument,
                edits: [
                    {
                        range,
                        newText: replacement
                    }
                ]
            }
        ] */
    });
}

connection.onExecuteCommand(async params => {
    const command = params.command;
    if (command === commandIds.runCodeMod) {
        // runCodeMod(params.arguments![0], params.arguments![1], params.arguments![2]);
    }
});

connection.listen();
