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
import smartSelectionService from './services/smartSelectionService';

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
            textDocumentSync: documents.syncKind
            // codeActionProvider: true
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

interface ExecuteTransformParams {
    codeModId: string;
    textDocumentIdentifier: vscode.VersionedTextDocumentIdentifier;
    selection: {
        anchor: vscode.Position;
        active: vscode.Position;
    };
}

interface ExecuteTransformResult {
    edit: {
        range: { start: vscode.Position; end: vscode.Position };
        newText: string;
    } | null;
}

export const executeTransformRequestType = new RequestType<
    ExecuteTransformParams,
    ExecuteTransformResult,
    void,
    void
>('javascriptBooster/executeTransform');

function getTextEdit(document: TextDocument, before: string, after: string) {
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
    const newText = after.substring(startPosAfter, endPosAfter);

    return {
        range,
        newText
    };
}

connection.onRequest(executeTransformRequestType, async params => {
    const { selection, codeModId, textDocumentIdentifier } = params;
    let result: ExecuteTransformResult = {
        edit: null
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

    const { range, newText } = getTextEdit(document, source, transformResult);

    result.edit = {
        range,
        newText
    };
    return result;
});

interface VscodeSelection {
    anchor: vscode.Position;
    active: vscode.Position;
}

interface ExtendSelectionParams {
    textDocumentUri: string;
    selections: VscodeSelection[];
}

interface ExtendSelectionResult {
    selections: VscodeSelection[] | null;
}

export const extendSelectionRequestType = new RequestType<
    ExtendSelectionParams,
    ExtendSelectionResult,
    void,
    void
>('javascriptBooster/extendSelection');

connection.onRequest(extendSelectionRequestType, async params => {
    const { textDocumentUri, selections } = params;
    let result: ExtendSelectionResult = {
        selections: null
    };

    const document = documents.get(textDocumentUri);
    if (!astService.isSupportedLanguage(document.languageId)) {
        return result;
    }

    const source = astService.normalizedText(document.getText());
    const ast = astService.getAstTree({
        languageId: document.languageId as LanguageId,
        fileName: document.uri,
        source
    });
    if (!ast) {
        return result;
    }

    result.selections = smartSelectionService
        .extendSelection({
            languageId: document.languageId as LanguageId,
            source,
            fileName: document.uri,
            ast,
            selections: selections.map(sel => ({
                anchor: astService.offsetAt(source, sel.anchor),
                active: astService.offsetAt(source, sel.active)
            }))
        })
        .map(sel => ({
            anchor: astService.positionAt(source, sel.anchor),
            active: astService.positionAt(source, sel.active)
        }));

    return result;
});

interface ShrinkSelectionParams {
    textDocumentUri: string;
    selections: VscodeSelection[];
}

interface ShrinkSelectionResult {
    selections: VscodeSelection[] | null;
}

export const shrinkSelectionRequestType = new RequestType<
    ShrinkSelectionParams,
    ShrinkSelectionResult,
    void,
    void
>('javascriptBooster/shrinkSelection');

connection.onRequest(shrinkSelectionRequestType, async params => {
    const { textDocumentUri, selections } = params;
    let result: ExtendSelectionResult = {
        selections: null
    };

    const document = documents.get(textDocumentUri);
    if (!astService.isSupportedLanguage(document.languageId)) {
        return result;
    }

    const source = astService.normalizedText(document.getText());
    const ast = astService.getAstTree({
        languageId: document.languageId as LanguageId,
        fileName: document.uri,
        source
    });
    if (!ast) {
        return result;
    }

    result.selections = smartSelectionService
        .shrinkSelection({
            languageId: document.languageId as LanguageId,
            source,
            fileName: document.uri,
            ast,
            selections: selections.map(sel => ({
                anchor: astService.offsetAt(source, sel.anchor),
                active: astService.offsetAt(source, sel.active)
            }))
        })
        .map(sel => ({
            anchor: astService.positionAt(source, sel.anchor),
            active: astService.positionAt(source, sel.active)
        }));

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

connection.listen();
