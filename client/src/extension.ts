'use strict';

import * as path from 'path';
import { commands, ExtensionContext, languages, Position, workspace } from 'vscode';
import {
    LanguageClient,
    LanguageClientOptions,
    RequestType,
    ServerOptions,
    TransportKind
} from 'vscode-languageclient';
import { CodeModCodeActionProvider } from './CodeModCodeActionProvider';
import { commandIds, extensionId } from './const';
import { runCodeModCommand } from './runCodeModCommand';
import astService from './services/astService';
import codeModService from './services/codeModService';
import langService from './services/langService';
import { extendSelectionCommand, shrinkSelectionCommand } from './smartSelectionCommands';

export function activate(context: ExtensionContext) {
    let serverModule = context.asAbsolutePath(path.join('server', 'src', 'server.js'));
    let serverOptions: ServerOptions = {
        run: {
            module: serverModule,
            transport: TransportKind.ipc,
            options: { cwd: process.cwd() }
        },
        debug: {
            module: serverModule,
            transport: TransportKind.ipc,
            options: { execArgv: ['--nolazy', '--inspect=6014'], cwd: process.cwd() }
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
        clientOptions
    );

    langService.initialize(languageClient);

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
