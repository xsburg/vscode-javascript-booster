import { RequestHandler, RequestType, TextDocument } from 'vscode-languageserver';
import astService, { LanguageId, Selection } from './services/astService';
import codeModService from './services/codeModService';
import connectionService from './services/connectionService';
import logService from './services/logService';
import getTextEdit from './utils/getTextEdit';
import * as vscode from './utils/vscodeExtra';

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
    selection: {
        anchor: vscode.Position;
        active: vscode.Position;
    } | null;
}

export const executeTransformRequestType = new RequestType<
    ExecuteTransformParams,
    ExecuteTransformResult,
    void,
    void
>('javascriptBooster/executeTransform');

export const executeTransformRequestHandler: RequestHandler<
    ExecuteTransformParams,
    ExecuteTransformResult,
    void
> = async params => {
    const { selection, codeModId, textDocumentIdentifier } = params;
    let result: ExecuteTransformResult = {
        edit: null,
        selection: null
    };

    const document = connectionService.getDocument(textDocumentIdentifier.uri);
    if (!astService.isSupportedLanguage(document.languageId)) {
        return result;
    }

    const source = document.getText();
    const offsetSelection = {
        anchor: astService.offsetAt(source, selection.anchor),
        active: astService.offsetAt(source, selection.active)
    };

    let transformResult: {
        source: string;
        selection?: Selection;
    };
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

    if (transformResult.source === source) {
        return result;
    }

    const { range, newText } = getTextEdit(source, transformResult.source);

    result.edit = {
        range: {
            start: document.positionAt(range.start),
            end: document.positionAt(range.end)
        },
        newText
    };
    if (transformResult.selection) {
        result.selection = {
            active: astService.positionAt(transformResult.source, transformResult.selection.active),
            anchor: astService.positionAt(transformResult.source, transformResult.selection.anchor)
        };
    }
    return result;
};
