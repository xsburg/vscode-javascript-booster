import { ExtensionContext, commands, window, workspace, Range, QuickPickItem, Uri } from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import codeModService, { LanguageId } from './services/codeModService';
import { CodeModDefinition } from './models/CodeMod';
import logService from './services/logService';

export async function runCodeModCommand(mod?: CodeModDefinition) {
    if (!window.activeTextEditor) {
        return;
    }
    const document = window.activeTextEditor.document;
    if (!codeModService.isSupportedLanguage(document.languageId)) {
        return;
    }

    if (!mod) {
        const codeMods = await codeModService.getGlobalMods();
        const result = await window.showQuickPick(
            codeMods.map(mod => ({
                label: mod.name,
                description: mod.description,
                detail: mod.detail,
                mod
            }))
        );
        if (!result) {
            return;
        }
        mod = result.mod;
    } else {
        mod = mod;
    }

    const source = document.getText();
    let result;
    try {
        result = codeModService.executeTransform(mod, {
            languageId: document.languageId as LanguageId,
            fileName: document.fileName,
            source,
            selection: {
                startPos: document.offsetAt(window.activeTextEditor.selection.start),
                endPos: document.offsetAt(window.activeTextEditor.selection.end)
            }
        });
    } catch (e) {
        logService.outputError(`Error while executing ${mod.id}.transform(): ${e.toString()}`);
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
