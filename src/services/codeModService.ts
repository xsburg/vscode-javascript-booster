import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import * as jscodeshift from 'jscodeshift';
import { CodeModDefinition, CodeModExports, CodeModScope } from '../models/CodeMod';
import { Position } from '../utils/Position';
import { Program } from 'ast-types';

class CodeModService {
    private _astCache: Map<
        string, // cached by fileName
        {
            source: string;
            ast: jscodeshift.Collection<Program>;
        }
    > = new Map();

    private _codeModsCache: CodeModDefinition[] | null = null;

    private _j: jscodeshift.JsCodeShift;

    constructor() {
        this._j = jscodeshift.withParser('tsx');
    }

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
            scope: (modFn.scope as CodeModScope) || CodeModScope.Global,
            modFn
        };
    }

    private async _getAllCodeMods() {
        if (this._codeModsCache) {
            return this._codeModsCache;
        }
        await this.reloadAllCodeMods();
        return this._codeModsCache;
    }

    public async reloadAllCodeMods(): Promise<CodeModDefinition[]> {
        const predefinedMods = fs
            .readdirSync(path.join(__dirname, '..', 'codemods'))
            .map(name => path.join(__dirname, '..', 'codemods', name))
            .filter(fileName => {
                return fileName.match(/(\.ts|\.js)$/) && fs.lstatSync(fileName).isFile();
            })
            .map(fileName => this._parseCodeModFile(fileName));
        const uris = await vscode.workspace.findFiles('codemods/*.{ts,js}');
        let codeMods = uris.map(uri => this._parseCodeModFile(uri.fsPath));
        codeMods.push(...predefinedMods);
        codeMods = codeMods.filter(c => c);
        codeMods.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
        this._codeModsCache = codeMods;
        return codeMods;
    }

    public async getCodeActionMods(options: {
        fileName: string;
        source: string;
        selection: { startPos: vscode.Position; endPos: vscode.Position };
    }) {
        const mods = await this._getAllCodeMods();
        return mods.filter(mod => {
            if (mod.scope !== CodeModScope.Cursor) {
                return false;
            }
            try {
                return mod.canRun(
                    {
                        path: options.fileName,
                        source: options.source,
                        ast: this._getAstTree(options)
                    },
                    {
                        jscodeshift: this._j,
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
        let result;
        result = options.mod.modFn(
            {
                path: options.fileName,
                source: options.source,
                ast: this._getAstTree(options)
            },
            {
                jscodeshift: this._j,
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

    private _getAstTree(options: { fileName: string; source: string }) {
        const cache = this._astCache.get(options.fileName);
        if (cache && cache.source === options.source) {
            return cache.ast;
        }
        const ast = this._j(options.source) as jscodeshift.Collection<Program>;
        this._astCache.set(options.fileName, {
            source: options.source,
            ast
        });
        return ast;
    }
}

export default new CodeModService();
