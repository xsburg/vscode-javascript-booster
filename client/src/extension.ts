'use strict';

import { commands, ExtensionContext, languages, Position, workspace } from 'vscode';
import {
    LanguageClient,
    LanguageClientOptions,
    RequestType,
    ServerOptions,
    TransportKind
} from 'vscode-languageclient';
import { CodeModCodeActionProvider } from './CodeModCodeActionProvider';
import { commandIds, extensionId, supportedLanguages } from './const';
import { executeCodeActionCommand } from './executeCodeActionCommand';
import langService from './services/langService';
import { extendSelectionCommand, shrinkSelectionCommand } from './smartSelectionCommands';

export function activate(context: ExtensionContext) {
    langService.initialize(context);

    context.subscriptions.push(
        langService.start(),
        commands.registerCommand(commandIds._executeCodeAction, executeCodeActionCommand),
        commands.registerCommand(commandIds.extendSelection, extendSelectionCommand),
        commands.registerCommand(commandIds.shrinkSelection, shrinkSelectionCommand),
        languages.registerCodeActionsProvider(supportedLanguages, new CodeModCodeActionProvider())
    );
}

export function deactivate() {}
