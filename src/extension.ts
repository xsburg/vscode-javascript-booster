'use strict';

import { commands, ExtensionContext, languages } from 'vscode';
import { runCodeModCommand } from './runCodeModCommand';
import { CodeModCodeActionProvider } from './CodeModCodeActionProvider';
import { commandIds } from './const';
import codeModService from './services/codeModService';
import astService from './services/astService';
import { extendSelectionCommand, shrinkSelectionCommand } from './smartSelectionCommands';

export function activate(context: ExtensionContext) {
    context.subscriptions.push(
        commands.registerCommand(commandIds.extendSelection, extendSelectionCommand),
        commands.registerCommand(commandIds.shrinkSelection, shrinkSelectionCommand),
        commands.registerCommand(commandIds.runCodeMod, runCodeModCommand),
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
