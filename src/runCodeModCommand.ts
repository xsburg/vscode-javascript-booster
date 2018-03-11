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

    const source = document.getText();
    const selection = {
        startPos: codeModService.offsetAt(document, window.activeTextEditor.selection.start),
        endPos: codeModService.offsetAt(document, window.activeTextEditor.selection.end)
    };

    if (!mod) {
        const codeMods = await codeModService.getGlobalMods({
            languageId: document.languageId as LanguageId,
            fileName: document.fileName,
            source,
            selection
        });
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

    let result;
    try {
        result = codeModService.executeTransform(mod, {
            languageId: document.languageId as LanguageId,
            fileName: document.fileName,
            source,
            selection
        });
    } catch (e) {
        logService.outputError(`Error while executing ${mod.id}.transform(): ${e.toString()}`);
        return;
    }

    if (result === source) {
        window.showInformationMessage('No changes.');
        return;
    }
    const allTextRange = new Range(document.positionAt(0), document.positionAt(source.length));
    window.activeTextEditor.edit(edit => {
        edit.replace(allTextRange, result);
    });
}
