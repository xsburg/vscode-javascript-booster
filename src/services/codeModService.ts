import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import * as jscodeshift from 'jscodeshift';
import { CodeModDefinition, CodeModExports } from '../models/CodeMod';
import { Position } from '../utils/Position';

class CodeModService {
    constructor() {}

    private _parseCodeModFile(fileName: string): CodeModDefinition {
        let modFn: CodeModExports;
        try {
            modFn = require(fileName);
        } catch (e) {
            console.error(`Failed to parse codemod '${fileName}: ${e.message}'`);
            return null;
        }
        const name = path.basename(fileName, path.extname(fileName));
        return {
            name: modFn.title || name,
            description: modFn.description || '',
            detail: modFn.detail,
            canRun: modFn.canRun || (() => true),
            modFn
        };
    }

    public loadAllCodeMods(): Thenable<CodeModDefinition[]> {
        return new Promise((resolve, reject) => {
            const predefinedMods = fs
                .readdirSync(path.join(__dirname, '..', 'codemods'))
                .map(name => path.join(__dirname, '..', 'codemods', name))
                .filter(fileName => {
                    return fs.lstatSync(fileName).isFile();
                })
                .map(fileName => this._parseCodeModFile(fileName));
            vscode.workspace.findFiles('codemods/*.{ts,js}').then(uris => {
                let codeMods = uris.map(uri => this._parseCodeModFile(uri.fsPath));
                codeMods.push(...predefinedMods);
                codeMods = codeMods.filter(c => c);
                codeMods.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
                resolve(codeMods);
            });
        });
    }

    public async getExecutableMods(options: {
        fileName: string;
        source: string;
        selection: { startPos: vscode.Position; endPos: vscode.Position };
    }) {
        const mods = await this.loadAllCodeMods();
        const j = jscodeshift.withParser('tsx');
        return mods.filter(mod => {
            try {
                return mod.canRun(
                    {
                        path: options.fileName,
                        source: options.source,
                        ast: j(options.source)
                    },
                    {
                        jscodeshift: j,
                        stats: () => ({})
                    },
                    {
                        selection: {
                            startPos: Position.fromLineCharacter(options.selection.startPos),
                            endPos: Position.fromLineCharacter(options.selection.endPos)
                        }
                    }
                );
            } catch (e) {
                console.error(`Error while running codemod.canRun: ${e.toString()}`);
                return false;
            }
        });
    }

    public runCodeMod(options: {
        mod: CodeModDefinition;
        fileName: string;
        source: string;
        selection: { startPos: vscode.Position; endPos: vscode.Position };
    }): string {
        const j = jscodeshift.withParser('tsx');
        let result;
        result = options.mod.modFn(
            {
                path: options.fileName,
                source: options.source,
                ast: j(options.source)
            },
            {
                jscodeshift: j,
                stats: () => ({})
            },
            {
                selection: {
                    startPos: Position.fromLineCharacter(options.selection.startPos),
                    endPos: Position.fromLineCharacter(options.selection.endPos)
                }
            }
        );
        if (!result) {
            return options.source;
        }
        return result;
    }
}

export default new CodeModService();
