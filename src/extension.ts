'use strict';

import { commands, ExtensionContext, languages } from 'vscode';
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
