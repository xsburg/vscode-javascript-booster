import { ExtensionContext, commands, window, workspace, Range, QuickPickItem, Uri } from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import codeModService from './services/codeModService';

export async function runCodeModCommand() {
    if (!window.activeTextEditor) {
        return;
    }
    const document = window.activeTextEditor.document;
    if (
        ['javascript', 'javascriptreact', 'typescript', 'typescriptreact'].indexOf(
            document.languageId
        ) === -1
    ) {
        return;
    }

    const codeMods = await codeModService.reloadAllCodeMods();
    const selectedMod = await window.showQuickPick(
        codeMods.map(mod => ({
            label: mod.name,
            description: mod.description,
            detail: mod.detail,
            mod
        }))
    );
    if (!selectedMod) {
        return;
    }

    const source = document.getText();
    let result;
    try {
        result = codeModService.runCodeMod({
            mod: selectedMod.mod,
            fileName: document.fileName,
            source,
            selection: {
                startPos: window.activeTextEditor.selection.start,
                endPos: window.activeTextEditor.selection.end
            }
        });
    } catch (e) {
        window.showErrorMessage(`Error while running codemod: ${e.message}`);
        console.error(`Error while running codemod: ${e.toString()}`);
        return;
    }

    if (result === source) {
        window.showInformationMessage('No changes.');
        return;
    }
    const allTextRange = new Range(document.positionAt(0), document.positionAt(source.length - 1));
    window.activeTextEditor.edit(edit => {
        edit.replace(allTextRange, result);
    });
}
