'use strict';

import { commands, ExtensionContext, languages } from 'vscode';
import { runCodeModCommand } from './runCodeModCommand';
import { CodeModCodeActionProvider } from './CodeModCodeActionProvider';

export function activate(context: ExtensionContext) {
    context.subscriptions.push(
        commands.registerCommand('javascriptActionPack.runCodeMod', runCodeModCommand)
    );
    context.subscriptions.push(
        languages.registerCodeActionsProvider(
            ['typescript', 'typescriptreact', 'javascript', 'javascriptreact'],
            new CodeModCodeActionProvider()
        )
    );
}

export function deactivate() { }
