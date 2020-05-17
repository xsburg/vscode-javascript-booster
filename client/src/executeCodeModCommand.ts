import { Position, Range, Selection, window } from 'vscode';
import { VersionedTextDocumentIdentifier } from 'vscode-languageclient';

import langService from './services/langService';

export async function executeCodeModCommand() {
    if (!window.activeTextEditor) {
        return;
    }
    const document = window.activeTextEditor.document;
    const documentRef = {
        uri: document.uri.toString(),
        version: document.version,
    };
    const selection = window.activeTextEditor.selection;

    /* const codeMods = await langService.requestGlobalCodeMods({
        textDocumentUri: document.uri.toString(),
        selection
    });
    const pickResult = await window.showQuickPick(
        codeMods.map(m => ({
            label: m.name,
            description: m.description,
            detail: m.detail,
            modId: m
        }))
    );
    if (!pickResult) {
        return;
    }

    const result = await langService.executeTransform(pickResult.modId, documentRef, selection);
    if (!result) {
        return;
    }

    await window.activeTextEditor!.edit(edit => {
        edit.replace(
            new Range(
                new Position(result.range.start.line, result.range.start.character),
                new Position(result.range.end.line, result.range.end.character)
            ),
            result.newText
        );
    }); */
}
