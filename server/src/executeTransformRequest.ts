import { RequestHandler, RequestType, TextDocument } from 'vscode-languageserver';
import astService, { LanguageId } from './services/astService';
import codeModService from './services/codeModService';
import connectionService from './services/connectionService';
import logService from './services/logService';
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

export const executeTransformRequestHandler: RequestHandler<
    ExecuteTransformParams,
    ExecuteTransformResult,
    void
> = async params => {
    const { selection, codeModId, textDocumentIdentifier } = params;
    let result: ExecuteTransformResult = {
        edit: null
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
};
