import * as vscode from 'vscode';
import { commandIds, isSupportedLanguage } from './const';
import langService from './services/langService';

export class CodeModCodeActionProvider implements vscode.CodeActionProvider {
    public async provideCodeActions(
        document: vscode.TextDocument,
        range: vscode.Range,
        context: vscode.CodeActionContext,
        token: vscode.CancellationToken
    ): Promise<vscode.Command[]> {
        if (!isSupportedLanguage(document.languageId)) {
            return [];
        }

        const source = document.getText();
        const textEditor = vscode.window.activeTextEditor;
        if (!textEditor) {
            // Complex commands, run-on-save etc
            return [];
        }

        const selection = textEditor.selection;
        const result = await langService.requestCodeActions(document.uri.toString(), selection);

        return result.codeMods.map(
            mod =>
                ({
                    title: mod.title,
                    tooltip: mod.tooltip,
                    command: commandIds.runCodeMod,
                    arguments: [mod.id, result.textDocument, selection]
                } as vscode.Command)
        );
    }
}
