import { workspace } from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import * as jscodeshift from 'jscodeshift';
import { CodeModDefinition } from '../models/CodeMod';

class CodeModService {
    constructor() {}

    private _parseCodeModFile(fileName: string): CodeModDefinition {
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

    public loadAllCodeMods(): Thenable<CodeModDefinition[]> {
        return new Promise((resolve, reject) => {
            const predefinedMods = fs
                .readdirSync(path.join(__dirname, '..', '..', 'codemods'))
                .map(name => path.join(__dirname, '..', '..', 'codemods', name))
                .filter(fileName => {
                    return fs.lstatSync(fileName).isFile();
                })
                .map(fileName => this._parseCodeModFile(fileName));
            workspace.findFiles('codemods/*.{ts,js}').then(uris => {
                let codeMods = uris.map(uri => this._parseCodeModFile(uri.fsPath));
                codeMods.push(...predefinedMods);
                codeMods = codeMods.filter(c => c);
                codeMods.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
                resolve(codeMods);
            });
        });
    }

    public runCodeMod(options: {
        mod: CodeModDefinition;
        fileName: string;
        source: string;
        selection: { startPos: number; endPos: number };
    }): string {
        const j = jscodeshift.withParser('tsx');
        let result;
        result = options.mod.modFn(
            {
                path: options.fileName,
                source: options.source
            },
            {
                jscodeshift: j,
                stats: () => ({})
            },
            {
                selection: options.selection
            }
        );
        if (!result) {
            return options.source;
        }
        return result;
    }
}

export default new CodeModService();
