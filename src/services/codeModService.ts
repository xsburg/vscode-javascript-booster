import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs-extra';
import * as jscodeshift from 'jscodeshift';
import { CodeModDefinition, CodeModExports, CodeModScope } from '../models/CodeMod';
import { Position } from '../utils/Position';
import { Program } from 'ast-types';
import { configIds, extensionId } from '../const';

const codeshifts = {
    javascript: jscodeshift.withParser('babylon'),
    javascriptreact: jscodeshift.withParser('babylon'),
    typescript: jscodeshift.withParser('typescript'),
    typescriptreact: jscodeshift.withParser('tsx')
};

class CodeModService {
    private _astCache: Map<
        string, // cached by fileName
        {
            source: string;
            ast: jscodeshift.Collection<Program>;
        }
    > = new Map();

    private _codeModsCache: CodeModDefinition[] | null = null;

    private _shiftsByExtension: {
        [extension: string]: jscodeshift.JsCodeShift;
    } = {};

    constructor() {
        const config = vscode.workspace.getConfiguration(extensionId);
        const extensionParserMap: any = config.get(configIds.extensionParser);
        extensionParserMap.forEach(x => {
            x.extensions.split(',').forEach(ext => {
                this._shiftsByExtension[ext] = codeshifts[x.parser];
            });
        });
    }

    private _getCodeShift(fileName: string) {
        const extension = path.extname(fileName);
        const shift = this._shiftsByExtension[extension];
        if (!shift) {
            console.warn(
                'File extension is not supported. Using default code shift (javascriptreact).'
            );
        }
        return codeshifts.javascriptreact;
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
        // local code mods
        const files = await fs.readdir(path.join(__dirname, '..', 'codemods'));
        const fileNames = files.map(name => path.join(__dirname, '..', 'codemods', name));
        const predefinedMods = (await Promise.all(
            fileNames.map(async fileName => {
                if (!fileName.match(/(\.ts|\.js)$/)) {
                    return {
                        isFile: false,
                        fileName
                    };
                }
                const stat = await fs.lstat(fileName);
                return {
                    isFile: stat.isFile(),
                    fileName
                };
            })
        ))
            .filter(x => x.isFile)
            .map(x => this._parseCodeModFile(x.fileName));
        // user-workspace code mods
        const config = vscode.workspace.getConfiguration(extensionId);
        const codemodDir = config.get(configIds.codemodDir);
        const uris = await vscode.workspace.findFiles(`${codemodDir}/*.{ts,js}`);
        let codeMods = uris.map(uri => this._parseCodeModFile(uri.fsPath));
        codeMods.push(...predefinedMods);
        codeMods = codeMods.filter(c => c);
        codeMods.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
        this._codeModsCache = codeMods;
        return codeMods;
    }

    public async getGlobalMods() {
        const mods = (await this._getAllCodeMods()).filter(
            mod => mod.scope === CodeModScope.Global
        );
        return mods;
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
                        jscodeshift: this._getCodeShift(options.fileName),
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
                jscodeshift: this._getCodeShift(options.fileName),
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
        const ast = this._getCodeShift(options.fileName)(options.source) as jscodeshift.Collection<
            Program
        >;
        this._astCache.set(options.fileName, {
            source: options.source,
            ast
        });
        return ast;
    }
}

export default new CodeModService();
