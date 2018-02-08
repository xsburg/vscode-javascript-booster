import { ExtensionContext, commands, window, workspace, Range, QuickPickItem, Uri } from 'vscode';
import * as path from 'path';
import * as jscodeshift from 'jscodeshift';

interface CodeMod {
    name: string;
    description: string;
    detail?: string;
    uri: Uri;
    modFn: (
        fileInfo: { path: string; source: string },
        api: { jscodeshift: any; stats: any },
        options: any
    ) => string | undefined | null;
}

function readCodeMods(): Thenable<CodeMod[]> {
    return new Promise((resolve, reject) => {
        workspace.findFiles('codemods/*.{ts,js}').then(uris => {
            const codeMods = uris.map(uri => {
                let modFn;
                try {
                    modFn = require(uri.fsPath);
                } catch (e) {
                    window.showErrorMessage(`Error while parsing codemod '${uri.fsPath}'`);
                }
                const fileName = path.basename(uri.fsPath, path.extname(uri.fsPath));
                return {
                    name: modFn.name || fileName,
                    description: modFn.description || '',
                    detail: modFn.detail,
                    uri,
                    modFn
                };
            });
            resolve(codeMods);
        });
    });
}

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

    const codeMods = await readCodeMods();
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

    // run the codemod
    const j = jscodeshift.withParser('babylon');
    let startPos = document.offsetAt(window.activeTextEditor.selection.start);
    let endPos = document.offsetAt(window.activeTextEditor.selection.end);
    if (startPos > endPos) {
        [startPos, endPos] = [endPos, startPos];
    }
    const text = document.getText();
    let result;
    try {
        result = selectedMod.mod.modFn(
            {
                path: document.fileName,
                source: text
            },
            {
                jscodeshift: j,
                stats: {}
            },
            {
                startPos,
                endPos
            }
        );
    } catch (e) {
        window.showErrorMessage(`Error while running codemod: ${e.message}`);
        return;
    }
    // handle the results
    if (result === null || result === undefined) {
        window.showInformationMessage('Nothing to change.');
        return;
    }
    if (result === text) {
        window.showErrorMessage('The codemod returned the same text that has been passed into it.');
    }
    const allTextRange = new Range(document.positionAt(0), document.positionAt(text.length - 1));
    window.activeTextEditor.edit(edit => {
        edit.replace(allTextRange, result);
    });
}
