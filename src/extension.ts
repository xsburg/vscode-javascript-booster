'use strict';

import { commands, ExtensionContext, languages } from 'vscode';
import { runCodeModCommand } from './runCodeModCommand';
import { CodeModCodeActionProvider } from './CodeModCodeActionProvider';
import { commandIds } from './const';
import codeModService from './services/codeModService';

export function activate(context: ExtensionContext) {
    context.subscriptions.push(commands.registerCommand(commandIds.runCodeMod, runCodeModCommand));
    context.subscriptions.push(
        commands.registerCommand(commandIds.reloadCodeMods, () => {
            codeModService.reloadAllCodeMods();
        })
    );
    context.subscriptions.push(
        languages.registerCodeActionsProvider(
            ['typescript', 'typescriptreact', 'javascript', 'javascriptreact'],
            new CodeModCodeActionProvider()
        )
    );
}

export function deactivate() {}
