import * as vscode from 'vscode';
import codeModService from './services/codeModService';
import { commandIds } from './const';
import astService, { LanguageId } from './services/astService';

export class CodeModCodeActionProvider implements vscode.CodeActionProvider {
    public async provideCodeActions(
        document: vscode.TextDocument,
        range: vscode.Range,
        context: vscode.CodeActionContext,
        token: vscode.CancellationToken
    ): Promise<vscode.Command[]> {
        if (!astService.isSupportedLanguage(document.languageId)) {
            return;
        }

        const source = document.getText();
        const codeMods = await codeModService.getCodeActionMods({
            languageId: document.languageId as LanguageId,
            fileName: document.fileName,
            source,
            selection: {
                anchor: astService.offsetAt(
                    source,
                    vscode.window.activeTextEditor.selection.anchor
                ),
                active: astService.offsetAt(source, vscode.window.activeTextEditor.selection.active)
            }
        });
        return codeMods.map(
            mod =>
                ({
                    title: mod.name, // Add an icon? ✏  ↪ ♦ 🚀 🍒 🔥 ☞ ⚡ ✎
                    tooltip: mod.detail || mod.description,
                    command: commandIds.runCodeMod,
                    arguments: [mod]
                } as vscode.Command)
        );
    }
}
