import * as path from 'path';
import * as vscode from 'vscode';
import {
    LanguageClient,
    LanguageClientOptions,
    RequestType,
    ServerOptions,
    TransportKind,
    VersionedTextDocumentIdentifier
} from 'vscode-languageclient';
import { extensionId, supportedLanguages } from '../const';

interface CodeActionsParams {
    textDocumentUri: string;
    selection: vscode.Selection;
}

interface CodeActionsResult {
    textDocument: VersionedTextDocumentIdentifier;
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

interface ExecuteTransformParams {
    codeModId: string;
    textDocumentIdentifier: VersionedTextDocumentIdentifier;
    selection: vscode.Selection;
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

interface ExtendSelectionParams {
    textDocumentUri: string;
    selections: vscode.Selection[];
}

interface ExtendSelectionResult {
    selections: vscode.Selection[] | null;
}

export const extendSelectionRequestType = new RequestType<
    ExtendSelectionParams,
    ExtendSelectionResult,
    void,
    void
>('javascriptBooster/extendSelection');

interface ShrinkSelectionParams {
    textDocumentUri: string;
    selections: vscode.Selection[];
}

interface ShrinkSelectionResult {
    selections: vscode.Selection[] | null;
}

export const shrinkSelectionRequestType = new RequestType<
    ShrinkSelectionParams,
    ShrinkSelectionResult,
    void,
    void
>('javascriptBooster/shrinkSelection');

class LangService {
    private _languageClient!: LanguageClient;

    public initialize(context: vscode.ExtensionContext) {
        let serverModule = context.asAbsolutePath(path.join('server', 'src', 'server.js'));
        let serverOptions: ServerOptions = {
            run: {
                module: serverModule,
                transport: TransportKind.ipc,
                options: { cwd: process.cwd() }
            },
            debug: {
                module: serverModule,
                transport: TransportKind.ipc,
                options: { execArgv: ['--nolazy', '--inspect=6014'], cwd: process.cwd() }
            }
        };

        let clientOptions: LanguageClientOptions = {
            documentSelector: supportedLanguages.map(language => ({ language })),
            synchronize: {
                configurationSection: extensionId
            }
        };

        this._languageClient = new LanguageClient(
            extensionId,
            'JavaScript Booster',
            serverOptions,
            clientOptions
        );
    }

    public start() {
        return this._languageClient.start();
    }

    public async requestCodeActions(textDocumentUri: string, selection: vscode.Selection) {
        const result = await this._languageClient.sendRequest(codeActionsRequestType, {
            textDocumentUri,
            selection
        });
        return result;
    }

    public async executeTransform(
        codeModId: string,
        textDocumentIdentifier: VersionedTextDocumentIdentifier,
        selection: vscode.Selection
    ) {
        const result = await this._languageClient.sendRequest(executeTransformRequestType, {
            codeModId,
            textDocumentIdentifier,
            selection
        });
        return result.edit;
    }

    public async extendSelection(textDocumentUri: string, selections: vscode.Selection[]) {
        const result = await this._languageClient.sendRequest(extendSelectionRequestType, {
            textDocumentUri,
            selections
        });
        return result.selections;
    }

    public async shrinkSelection(textDocumentUri: string, selections: vscode.Selection[]) {
        const result = await this._languageClient.sendRequest(shrinkSelectionRequestType, {
            textDocumentUri,
            selections
        });
        return result.selections;
    }
}

export default new LangService();
