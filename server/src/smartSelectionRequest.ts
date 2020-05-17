import { IConnection, RequestHandler, RequestType } from 'vscode-languageserver';

import astService, { LanguageId } from './services/astService';
import connectionService from './services/connectionService';
import smartSelectionService from './services/smartSelectionService';
import * as vscode from './utils/vscodeExtra';

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

export const extendSelectionRequestHandler: RequestHandler<
    ExtendSelectionParams,
    ExtendSelectionResult,
    void
> = async (params) => {
    const { textDocumentUri, selections } = params;
    let result: ExtendSelectionResult = {
        selections: null,
    };

    const document = connectionService.getDocument(textDocumentUri);
    if (!astService.isSupportedLanguage(document.languageId)) {
        return result;
    }

    const source = astService.normalizedText(document.getText());
    const ast = astService.getAstTree({
        languageId: document.languageId as LanguageId,
        fileName: document.uri,
        source,
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
            selections: selections.map((sel) => ({
                anchor: astService.offsetAt(source, sel.anchor),
                active: astService.offsetAt(source, sel.active),
            })),
        })
        .map((sel) => ({
            anchor: astService.positionAt(source, sel.anchor),
            active: astService.positionAt(source, sel.active),
        }));

    return result;
};

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

export const shrinkSelectionRequestHandler: RequestHandler<
    ShrinkSelectionParams,
    ShrinkSelectionResult,
    void
> = async (params) => {
    const { textDocumentUri, selections } = params;
    let result: ExtendSelectionResult = {
        selections: null,
    };

    const document = connectionService.getDocument(textDocumentUri);
    if (!astService.isSupportedLanguage(document.languageId)) {
        return result;
    }

    const source = astService.normalizedText(document.getText());
    const ast = astService.getAstTree({
        languageId: document.languageId as LanguageId,
        fileName: document.uri,
        source,
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
            selections: selections.map((sel) => ({
                anchor: astService.offsetAt(source, sel.anchor),
                active: astService.offsetAt(source, sel.active),
            })),
        })
        .map((sel) => ({
            anchor: astService.positionAt(source, sel.anchor),
            active: astService.positionAt(source, sel.active),
        }));

    return result;
};
