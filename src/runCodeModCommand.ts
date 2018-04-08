import * as fs from 'fs';
import * as path from 'path';
import {
    commands,
    ExtensionContext,
    QuickPickItem,
    Range,
    TextDocument,
    Uri,
    window,
    workspace
} from 'vscode';
import { CodeModDefinition } from './models/CodeMod';
import astService, { LanguageId } from './services/astService';
import codeModService from './services/codeModService';
import logService from './services/logService';

async function updateText(document: TextDocument, before: string, after: string): Promise<void> {
    let startPosBefore = 0;
    let startPosAfter = 0;
    while (startPosBefore < before.length && startPosAfter < after.length) {
        const cb = before[startPosBefore];
        const ca = after[startPosAfter];
        if (cb === ca) {
            startPosBefore++;
            startPosAfter++;
        } else if (cb === '\r' && before[startPosBefore + 1] === '\n' && ca === '\n') {
            // \n removed after transformation
            startPosBefore++;
        } else if (ca === '\r' && after[startPosAfter + 1] === '\n' && cb === '\n') {
            // \n added after transformation
            startPosAfter++;
        } else {
            break;
        }
    }

    let endPosBefore = before.length;
    let endPosAfter = after.length;
    while (endPosBefore - 1 >= 0 && endPosAfter - 1 >= 0) {
        const cb = before[endPosBefore - 1];
        const ca = after[endPosAfter - 1];
        if (cb === ca) {
            endPosBefore--;
            endPosAfter--;
        } else if (cb === '\r' && before[endPosBefore] === '\n') {
            // \n removed after transformation
            endPosBefore--;
        } else if (ca === '\r' && after[endPosAfter] === '\n') {
            // \n added after transformation
            endPosAfter--;
        } else {
            break;
        }
    }

    const range = new Range(document.positionAt(startPosBefore), document.positionAt(endPosBefore));
    const replacement = after.substring(startPosAfter, endPosAfter);

    await window.activeTextEditor!.edit(edit => {
        edit.replace(range, replacement);
    });
}

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

    await updateText(document, source, result);
}
