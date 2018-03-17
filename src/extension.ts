'use strict';

import { commands, ExtensionContext, languages, RelativePattern, window, workspace } from 'vscode';
import { CodeModCodeActionProvider } from './CodeModCodeActionProvider';
import { commandIds } from './const';
import { runCodeModCommand } from './runCodeModCommand';
import astService from './services/astService';
import codeModService from './services/codeModService';
import { extendSelectionCommand, shrinkSelectionCommand } from './smartSelectionCommands';

export function activate(context: ExtensionContext) {
    context.subscriptions.push(
        commands.registerCommand(commandIds.extendSelection, extendSelectionCommand),
        commands.registerCommand(commandIds.shrinkSelection, shrinkSelectionCommand),
        commands.registerCommand(commandIds.runCodeMod, runCodeModCommand),
        commands.registerCommand(commandIds.runCodeModOverDir, async uri => {
            const files = await workspace.findFiles(
                new RelativePattern(uri.path, '**/*.{js,ts,jsx,tsx}')
            );
            const mod = codeModService.loadOneEmbeddedCodeMod('g-simplify-redux-actions');
            await Promise.all(
                files.map(async f => {
                    const document = await workspace.openTextDocument(f.fsPath);
                    await window.showTextDocument(document);
                    await commands.executeCommand(commandIds.runCodeMod, mod);
                })
            );
        }),
        commands.registerCommand(commandIds.reloadCodeMods, () => {
            codeModService.reloadAllCodeMods();
        }),
        languages.registerCodeActionsProvider(
            astService.supportedlanguages,
            new CodeModCodeActionProvider()
        )
    );
}

export function deactivate() {}
