import * as vscode from 'vscode';
import codeModService, { LanguageId } from './services/codeModService';
import { commandIds } from './const';

export class CodeModCodeActionProvider implements vscode.CodeActionProvider {
    public async provideCodeActions(
        document: vscode.TextDocument,
        range: vscode.Range,
        context: vscode.CodeActionContext,
        token: vscode.CancellationToken
    ): Promise<vscode.Command[]> {
        if (!codeModService.isSupportedLanguage(document.languageId)) {
            return;
        }

        const source = document.getText();
        const codeMods = await codeModService.getCodeActionMods({
            languageId: document.languageId as LanguageId,
            fileName: document.fileName,
            source,
            selection: {
                startPos: codeModService.offsetAt(document, range.start),
                endPos: codeModService.offsetAt(document, range.end)
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
