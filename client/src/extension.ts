'use strict';

import * as path from 'path';
import { commands, ExtensionContext, languages, workspace } from 'vscode';
import {
    LanguageClient,
    LanguageClientOptions,
    ServerOptions,
    TransportKind
} from 'vscode-languageclient';
import { CodeModCodeActionProvider } from './CodeModCodeActionProvider';
import { commandIds, extensionId } from './const';
import { runCodeModCommand } from './runCodeModCommand';
import astService from './services/astService';
import codeModService from './services/codeModService';
import { extendSelectionCommand, shrinkSelectionCommand } from './smartSelectionCommands';

export function activate(context: ExtensionContext) {
    let serverModule = context.asAbsolutePath(path.join('server', 'src', 'server.js'));
    let serverOptions: ServerOptions = {
        run: { module: serverModule, transport: TransportKind.ipc },
        debug: {
            module: serverModule,
            transport: TransportKind.ipc,
            options: { execArgv: ['--nolazy', '--inspect=6010'] }
        }
    };

    // Options to control the language client
    let clientOptions: LanguageClientOptions = {
        // Register the server for plain text documents
        documentSelector: [
            { language: 'typescript', scheme: 'file' },
            { language: 'typescriptreact', scheme: 'file' },
            { language: 'javascript', scheme: 'file' },
            { language: 'javascriptreact', scheme: 'file' }
        ],
        synchronize: {
            configurationSection: extensionId
        }
    };

    const languageClient = new LanguageClient(
        'jsBoosterLangServer',
        'JavaScript Booster Language Server',
        serverOptions,
        clientOptions,
        true
    );

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
        ),
        languageClient.start()
    );
}

export function deactivate() {}
