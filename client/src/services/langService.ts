import * as vscode from 'vscode';
import { LanguageClient, RequestType } from 'vscode-languageclient';

interface CodeActionsParams {
    textDocumentUri: string;
    selection: {
        anchor: vscode.Position;
        active: vscode.Position;
    };
}

interface CodeActionsResult {
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
        return result.codeMods;
    }
}

export default new LangService();
