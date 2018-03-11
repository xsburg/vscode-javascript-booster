import { window, Selection } from 'vscode';
import astService, { LanguageId } from './services/astService';
import smartSelectionService from './services/smartSelectionService';

export async function extendSelectionCommand() {
    if (!window.activeTextEditor) {
        return;
    }
    const document = window.activeTextEditor.document;
    if (!astService.isSupportedLanguage(document.languageId)) {
        return;
    }

    const source = document.getText();
    const ast = astService.getAstTree({
        languageId: document.languageId as LanguageId,
        fileName: document.fileName,
        source
    });

    window.activeTextEditor.selections = window.activeTextEditor.selections.map(selection => {
        const result = smartSelectionService.extendSelection(
            document.languageId as LanguageId,
            ast,
            {
                anchor: astService.offsetAt(source, window.activeTextEditor.selection.anchor),
                active: astService.offsetAt(source, window.activeTextEditor.selection.active)
            }
        );
        const anchor = astService.positionAt(source, result.anchor);
        const active = astService.positionAt(source, result.active);
        return new Selection(anchor, active);
    });
}

export async function shrinkSelectionCommand() {}
