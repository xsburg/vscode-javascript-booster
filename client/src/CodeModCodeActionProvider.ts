import * as vscode from 'vscode';

import { commandIds, isSupportedLanguage } from './const';
import langService from './services/langService';
import { isSelection } from './utils/isSelection';

export class CodeModCodeActionProvider implements vscode.CodeActionProvider {
    public async provideCodeActions(
        document: vscode.TextDocument,
        selection: vscode.Range | vscode.Selection,
        context: vscode.CodeActionContext,
        token: vscode.CancellationToken
    ): Promise<vscode.Command[]> {
        if (!isSupportedLanguage(document.languageId)) {
            return [];
        }

        if (!isSelection(selection)) {
            // Complex commands, run-on-save etc
            return [];
        }

        const result = await langService.requestCodeActions(document.uri.toString(), selection);

        return result.codeMods.map(
            (mod) =>
                ({
                    title: mod.title,
                    tooltip: mod.tooltip,
                    command: commandIds._executeCodeAction,
                    arguments: [mod.id, result.textDocument, selection],
                } as vscode.Command)
        );
    }
}
