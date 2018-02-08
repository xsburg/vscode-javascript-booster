'use strict';

import { commands, ExtensionContext } from 'vscode';

import { runCodeModCommand } from './runCodeModCommand';

export function activate(context: ExtensionContext) {
    context.subscriptions.push(
        commands.registerCommand('javascriptActionPack.runCodeMod', runCodeModCommand)
    );
}

export function deactivate() {}
