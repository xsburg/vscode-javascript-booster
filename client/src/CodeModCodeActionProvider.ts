import * as vscode from 'vscode';
import { commandIds } from './const';
import astService, { LanguageId } from './services/astService';
import codeModService from './services/codeModService';
import langService from './services/langService';

export class CodeModCodeActionProvider implements vscode.CodeActionProvider {
    public async provideCodeActions(
        document: vscode.TextDocument,
        range: vscode.Range,
        context: vscode.CodeActionContext,
        token: vscode.CancellationToken
    ): Promise<vscode.Command[]> {
        if (!astService.isSupportedLanguage(document.languageId)) {
            return [];
        }

        const source = document.getText();
        const activeTextEditor = vscode.window.activeTextEditor!;

        const codeMods = await langService.requestCodeActions(
            document.uri.toString(),
            activeTextEditor.selection
        );

        return codeMods.map(
            mod =>
                ({
                    title: mod.title,
                    tooltip: mod.tooltip,
                    command: commandIds.runCodeMod,
                    arguments: [mod.id]
                } as vscode.Command)
        );
    }
}
