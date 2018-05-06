import { commands, Selection, window, workspace } from 'vscode';
import { configIds, extensionId } from './const';
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

    const source = astService.normalizedText(document.getText());
    const ast = astService.getAstTree({
        languageId: document.languageId as LanguageId,
        fileName: document.fileName,
        source
    });
    if (!ast) {
        executeFallbackSelectionCommand(true);
        return;
    }

    window.activeTextEditor!.selections = smartSelectionService
        .extendSelection({
            languageId: document.languageId as LanguageId,
            source,
            fileName: document.fileName,
            ast,
            selections: window.activeTextEditor!.selections.map(sel => ({
                anchor: astService.offsetAt(source, sel.anchor),
                active: astService.offsetAt(source, sel.active)
            }))
        })
        .map(
            sel =>
                new Selection(
                    astService.positionAt(source, sel.anchor),
                    astService.positionAt(source, sel.active)
                )
        );
}

export async function shrinkSelectionCommand() {
    if (!window.activeTextEditor) {
        return;
    }
    const document = window.activeTextEditor.document;
    if (!astService.isSupportedLanguage(document.languageId)) {
        executeFallbackSelectionCommand(false);
        return;
    }

    const source = astService.normalizedText(document.getText());
    const ast = astService.getAstTree({
        languageId: document.languageId as LanguageId,
        fileName: document.fileName,
        source
    });
    if (!ast) {
        executeFallbackSelectionCommand(false);
        return;
    }

    window.activeTextEditor!.selections = smartSelectionService
        .shrinkSelection({
            languageId: document.languageId as LanguageId,
            source,
            fileName: document.fileName,
            ast,
            selections: window.activeTextEditor!.selections.map(sel => ({
                anchor: astService.offsetAt(source, sel.anchor),
                active: astService.offsetAt(source, sel.active)
            }))
        })
        .map(
            sel =>
                new Selection(
                    astService.positionAt(source, sel.anchor),
                    astService.positionAt(source, sel.active)
                )
        );
}
