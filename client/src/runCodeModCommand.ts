import * as fs from 'fs';
import * as path from 'path';
import {
    commands,
    ExtensionContext,
    Position,
    QuickPickItem,
    Range,
    Selection,
    TextDocument,
    Uri,
    window,
    workspace
} from 'vscode';
import { VersionedTextDocumentIdentifier } from 'vscode-languageclient/lib/main';
import { CodeModDefinition } from './models/CodeMod';
import astService, { LanguageId } from './services/astService';
import codeModService from './services/codeModService';
import langService from './services/langService';
import logService from './services/logService';

export async function runCodeModCommand(
    modId: string,
    textDocument: VersionedTextDocumentIdentifier,
    selection: Selection
) {
    if (!window.activeTextEditor) {
        return;
    }
    const document = window.activeTextEditor.document;
    if (!astService.isSupportedLanguage(document.languageId)) {
        return;
    }

    const result = await langService.requestTransformation(modId, textDocument, selection);
    if (!result) {
        return;
    }

    await window.activeTextEditor!.edit(edit => {
        edit.replace(
            new Range(
                new Position(result.range.start.line, result.range.start.character),
                new Position(result.range.end.line, result.range.end.character)
            ),
            result.newText
        );
    });
    /* if (!window.activeTextEditor) {
        return;
    }
    const document = window.activeTextEditor.document;
    if (!astService.isSupportedLanguage(document.languageId)) {
        return;
    }

    langService.requestTransformation(mod);

    const source = document.getText();
    selection = selection || {
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

    await updateText(document, source, result); */
}
