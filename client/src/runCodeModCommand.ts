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

    const result = await langService.executeTransform(modId, textDocument, selection);
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
}
