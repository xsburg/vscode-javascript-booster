import * as vscode from 'vscode';
import { commandIds } from './const';
import astService, { LanguageId } from './services/astService';
import codeModService from './services/codeModService';

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
        const codeMods = await codeModService.getCodeActionMods({
            languageId: document.languageId as LanguageId,
            fileName: document.fileName,
            source,
            selection: {
                anchor: astService.offsetAt(source, activeTextEditor.selection.anchor),
                active: astService.offsetAt(source, activeTextEditor.selection.active)
            }
        });
        return codeMods.map(
            mod =>
                ({
                    title: mod.name,
                    tooltip: mod.detail || mod.description,
                    command: commandIds.runCodeMod,
                    arguments: [mod]
                } as vscode.Command)
        );
    }
}
