'use strict';

import { commands, ExtensionContext, languages } from 'vscode';
import { CodeModCodeActionProvider } from './CodeModCodeActionProvider';
import { commandIds, supportedLanguages } from './const';
import { executeCodeActionCommand } from './executeCodeActionCommand';
import { executeCodeModCommand } from './executeCodeModCommand';
import langService from './services/langService';
import { extendSelectionCommand, shrinkSelectionCommand } from './smartSelectionCommands';

export async function activate(context: ExtensionContext) {
    langService.initialize(context);
    context.subscriptions.push(langService.start());
    await langService.ready();

    context.subscriptions.push(
        commands.registerCommand(commandIds._executeCodeAction, executeCodeActionCommand),
        commands.registerCommand(commandIds.executeCodeMod, executeCodeModCommand),
        commands.registerCommand(commandIds.extendSelection, extendSelectionCommand),
        commands.registerCommand(commandIds.shrinkSelection, shrinkSelectionCommand),
        languages.registerCodeActionsProvider(supportedLanguages, new CodeModCodeActionProvider())
    );
}

export function deactivate() {}

if (process.env.NODE_ENV !== 'production') {
    // tslint:disable-next-line:no-var-requires
    const testRunnerExports = require('../tests/index');
    module.exports.testRunnerExports = testRunnerExports;
    module.exports.defineIntegrationTests = function defineTests() {
        require('../tests/integration.test');
    };
}
