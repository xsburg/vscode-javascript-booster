import { Position, Range, Selection, TextDocument, window } from 'vscode';
import { VersionedTextDocumentIdentifier } from 'vscode-languageclient';
import langService from './services/langService';

export async function executeCodeActionCommand(
    modId: string,
    textDocument: VersionedTextDocumentIdentifier,
    selection: Selection
) {
    if (!window.activeTextEditor) {
        return;
    }

    const result = await langService.executeTransform(modId, textDocument, selection);
    if (!result.edit) {
        return;
    }

    await window.activeTextEditor!.edit(edit => {
        edit.replace(
            new Range(
                new Position(result.edit!.range.start.line, result.edit!.range.start.character),
                new Position(result.edit!.range.end.line, result.edit!.range.end.character)
            ),
            result.edit!.newText
        );
    });
    if (result.selection) {
        window.activeTextEditor!.selection = result.selection;
    }
}
