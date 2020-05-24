import { RequestHandler, RequestType } from 'vscode-languageserver';

import astService, { LanguageId } from './services/astService';
import codeModService from './services/codeModService';
import connectionService from './services/connectionService';
import * as vscode from './utils/vscodeExtra';

interface CodeActionsParams {
    textDocumentUri: string;
    selection: vscode.Selection;
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

export const codeActionsRequestHandler: RequestHandler<
    CodeActionsParams,
    CodeActionsResult,
    void
> = async (params) => {
    let result: CodeActionsResult;

    const document = connectionService.getDocument(params.textDocumentUri);
    const source = document.getText();
    const codeMods = await codeModService.getExecutableCodeModsUnderCursor({
        languageId: document.languageId as LanguageId,
        fileName: document.uri,
        source,
        selection: {
            anchor: astService.offsetAt(source, params.selection.anchor),
            active: astService.offsetAt(source, params.selection.active),
        },
    });

    result = {
        textDocument: {
            uri: document.uri,
            version: document.version,
        },
        codeMods: codeMods.map((mod) => ({
            id: mod.id,
            title: mod.name,
            tooltip: mod.detail || mod.description,
        })),
    };
    return result;
};
