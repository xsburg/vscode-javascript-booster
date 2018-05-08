import * as vscode from 'vscode';
import {
    LanguageClient,
    RequestType,
    VersionedTextDocumentIdentifier
} from 'vscode-languageclient';

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

interface ProduceTransformationParams {
    codeModId: string;
    textDocumentIdentifier: VersionedTextDocumentIdentifier;
    selection: vscode.Selection;
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

class LangService {
    private _languageClient!: LanguageClient;

    public initialize(languageClient: LanguageClient) {
        this._languageClient = languageClient;
    }

    public async requestCodeActions(textDocumentUri: string, selection: vscode.Selection) {
        const result = await this._languageClient.sendRequest(codeActionsRequestType, {
            textDocumentUri,
            selection
        });
        return result;
    }

    public async requestTransformation(
        codeModId: string,
        textDocumentIdentifier: VersionedTextDocumentIdentifier,
        selection: vscode.Selection
    ) {
        const result = await this._languageClient.sendRequest(produceTransformationRequestType, {
            codeModId,
            textDocumentIdentifier,
            selection
        });
        return result.edits;
    }
}

export default new LangService();
