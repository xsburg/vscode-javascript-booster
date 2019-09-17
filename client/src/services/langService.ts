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

export const codeActionsRequestType = new RequestType<
    {
        textDocumentUri: string;
        selection: vscode.Selection;
    },
    {
        textDocument: VersionedTextDocumentIdentifier;
        codeMods: Array<{
            id: string;
            title: string;
            tooltip?: string;
        }>;
    },
    void,
    void
>('javascriptBooster/codeActions');

export const executeTransformRequestType = new RequestType<
    {
        codeModId: string;
        textDocumentIdentifier: VersionedTextDocumentIdentifier;
        selection: vscode.Selection;
    },
    {
        edit: {
            range: { start: vscode.Position; end: vscode.Position };
            newText: string;
        } | null;
        selection: vscode.Selection | null;
    },
    void,
    void
>('javascriptBooster/executeTransform');

export const extendSelectionRequestType = new RequestType<
    {
        textDocumentUri: string;
        selections: vscode.Selection[];
    },
    {
        selections: vscode.Selection[] | null;
    },
    void,
    void
>('javascriptBooster/extendSelection');

export const shrinkSelectionRequestType = new RequestType<
    {
        textDocumentUri: string;
        selections: vscode.Selection[];
    },
    {
        selections: vscode.Selection[] | null;
    },
    void,
    void
>('javascriptBooster/shrinkSelection');

class LangService {
    private _languageClient!: LanguageClient;

    public initialize(context: vscode.ExtensionContext) {
        if (this._languageClient) {
            // Already initialized
            return;
        }

        let serverModule = context.asAbsolutePath(path.join('dist', 'server', 'server.js'));
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

    public ready() {
        return this._languageClient.onReady();
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
        if (result.selection) {
            result.selection = this._rebuildSelection(result.selection);
        }
        return result;
    }

    public async extendSelection(textDocumentUri: string, selections: vscode.Selection[]) {
        const result = await this._languageClient.sendRequest(extendSelectionRequestType, {
            textDocumentUri,
            selections
        });
        if (!result.selections) {
            return null;
        }
        return result.selections.map(sel => this._rebuildSelection(sel));
    }

    public async shrinkSelection(textDocumentUri: string, selections: vscode.Selection[]) {
        const result = await this._languageClient.sendRequest(shrinkSelectionRequestType, {
            textDocumentUri,
            selections
        });
        if (!result.selections) {
            return null;
        }
        return result.selections.map(sel => this._rebuildSelection(sel));
    }

    private _rebuildSelection(sel: vscode.Selection) {
        return new vscode.Selection(
            new vscode.Position(sel.anchor.line, sel.anchor.character),
            new vscode.Position(sel.active.line, sel.active.character)
        );
    }
}

export default new LangService();
