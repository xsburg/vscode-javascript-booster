import { commands, Position, Selection, window, workspace } from 'vscode';

import { configIds, extensionId, isSupportedLanguage } from './const';
import langService from './services/langService';

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
    if (!isSupportedLanguage(document.languageId)) {
        executeFallbackSelectionCommand(true);
        return;
    }

    const newSelections = await langService.extendSelection(
        document.uri.toString(),
        window.activeTextEditor!.selections
    );

    if (!newSelections) {
        executeFallbackSelectionCommand(true);
        return;
    }

    window.activeTextEditor!.selections = newSelections.map(
        (sel) =>
            new Selection(
                new Position(sel.anchor.line, sel.anchor.character),
                new Position(sel.active.line, sel.active.character)
            )
    );
}

export async function shrinkSelectionCommand() {
    if (!window.activeTextEditor) {
        return;
    }

    const document = window.activeTextEditor.document;
    if (!isSupportedLanguage(document.languageId)) {
        executeFallbackSelectionCommand(false);
        return;
    }

    const newSelections = await langService.shrinkSelection(
        document.uri.toString(),
        window.activeTextEditor!.selections
    );

    if (!newSelections) {
        executeFallbackSelectionCommand(false);
        return;
    }

    window.activeTextEditor!.selections = newSelections.map(
        (sel) =>
            new Selection(
                new Position(sel.anchor.line, sel.anchor.character),
                new Position(sel.active.line, sel.active.character)
            )
    );
}
