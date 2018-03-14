import { configIds, extensionId } from 'const';
import { commands, Selection, window, workspace } from 'vscode';
import astService, { LanguageId } from './services/astService';
import smartSelectionService from './services/smartSelectionService';

function executeFallbackSelectionCommand(extend: boolean) {
    const config = workspace.getConfiguration(extensionId);
    if (extend) {
        const commandId = config.get<string>(configIds.smartExtendFallbackCommand)!;
        commands.executeCommand(commandId);
    } else {
        const commandId = config.get<string>(configIds.smartShrinkFallbackCommand)!;
        commands.executeCommand(commandId);
    }
}

export async function extendSelectionCommand() {
    if (!window.activeTextEditor) {
        return;
    }
    const document = window.activeTextEditor.document;
    if (!astService.isSupportedLanguage(document.languageId)) {
        executeFallbackSelectionCommand(true);
        return;
    }

    const source = document.getText();
    const ast = astService.getAstTree({
        languageId: document.languageId as LanguageId,
        fileName: document.fileName,
        source
    });
    if (!ast) {
        executeFallbackSelectionCommand(true);
        return;
    }

    window.activeTextEditor.selections = window.activeTextEditor.selections.map(selection => {
        const result = smartSelectionService.extendSelection(
            document.languageId as LanguageId,
            ast,
            {
                anchor: astService.offsetAt(source, window.activeTextEditor!.selection.anchor),
                active: astService.offsetAt(source, window.activeTextEditor!.selection.active)
            }
        );
        const anchor = astService.positionAt(source, result.anchor);
        const active = astService.positionAt(source, result.active);
        return new Selection(anchor, active);
    });
}

export async function shrinkSelectionCommand() {}
