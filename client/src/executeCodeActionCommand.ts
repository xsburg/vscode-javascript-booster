import { Position, Range, Selection, window } from 'vscode';
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
    const document = window.activeTextEditor.document;

    const result = await langService.executeTransform(modId, textDocument, selection);
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
    });
}
