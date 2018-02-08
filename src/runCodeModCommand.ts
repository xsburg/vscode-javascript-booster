import { ExtensionContext, commands, window, workspace, Range, QuickPickItem, Uri } from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import * as jscodeshift from 'jscodeshift';

interface CodeMod {
    name: string;
    description: string;
    detail?: string;
    modFn: (
        fileInfo: { path: string; source: string },
        api: { jscodeshift: any; stats: any },
        options: any
    ) => string | undefined | null;
}

function parseCodeModFile(fileName: string): CodeMod {
    let modFn;
    try {
        modFn = require(fileName);
    } catch (e) {
        console.error(`Failed to parse codemod '${fileName}: ${e.message}'`);
        return null;
    }
    const name = path.basename(fileName, path.extname(fileName));
    return {
        name: modFn.name || name,
        description: modFn.description || '',
        detail: modFn.detail,
        modFn
    };
}

function readCodeMods(): Thenable<CodeMod[]> {
    return new Promise((resolve, reject) => {
        const predefinedMods = fs
            .readdirSync(path.join(__dirname, '..', 'codemods'))
            .map(name => path.join(__dirname, '..', 'codemods', name))
            .filter(fileName => {
                return fs.lstatSync(fileName).isFile();
            })
            .map(fileName => parseCodeModFile(fileName));
        workspace.findFiles('codemods/*.{ts,js}').then(uris => {
            let codeMods = uris.map(uri => parseCodeModFile(uri.fsPath));
            codeMods.push(...predefinedMods);
            codeMods = codeMods.filter(c => c);
            codeMods.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
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
    if (result === null || result === undefined || result === text) {
        window.showInformationMessage('Nothing to change.');
        return;
    }
    const allTextRange = new Range(document.positionAt(0), document.positionAt(text.length - 1));
    window.activeTextEditor.edit(edit => {
        edit.replace(allTextRange, result);
    });
}
