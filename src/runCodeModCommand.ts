import * as fs from 'fs';
import * as path from 'path';
import { commands, ExtensionContext, QuickPickItem, Range, Uri, window, workspace } from 'vscode';
import { CodeModDefinition } from './models/CodeMod';
import astService, { LanguageId } from './services/astService';
import codeModService from './services/codeModService';
import logService from './services/logService';

export async function runCodeModCommand(mod?: CodeModDefinition) {
    if (!window.activeTextEditor) {
        return;
    }
    const document = window.activeTextEditor.document;
    if (!astService.isSupportedLanguage(document.languageId)) {
        return;
    }

    const source = document.getText();
    const selection = {
        anchor: astService.offsetAt(source, window.activeTextEditor.selection.anchor),
        active: astService.offsetAt(source, window.activeTextEditor.selection.active)
    };

    if (!mod) {
        const codeMods = await codeModService.getGlobalMods({
            languageId: document.languageId as LanguageId,
            fileName: document.fileName,
            source,
            selection
        });
        const pickResult = await window.showQuickPick(
            codeMods.map(m => ({
                label: m.name,
                description: m.description,
                detail: m.detail,
                mod: m
            }))
        );
        if (!pickResult) {
            return;
        }
        mod = pickResult.mod;
    } else {
        mod = mod;
    }

    let result: string;
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
