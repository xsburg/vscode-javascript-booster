import { File, Program } from 'ast-types';
import * as fs from 'fs-extra';
import * as os from 'os';
import * as path from 'path';
import Uri from 'vscode-uri';
import { CodeModDefinition, CodeModExports, CodeModScope } from '../codeModTypes';
import { configIds, extensionId } from '../const';
import { Position } from '../utils/Position';
import astService, { LanguageId, Selection } from './astService';
import connectionService from './connectionService';
import logService from './logService';

const embeddedCodeModDir = path.join(__dirname, '..', 'codemods');

class CodeModService {
    private _codeModsCache: CodeModDefinition[] | null = null;

    public async reloadAllCodeMods(): Promise<CodeModDefinition[]> {
        // local code mods
        const files = await fs.readdir(embeddedCodeModDir);
        const fileNames = files.map(name => path.join(embeddedCodeModDir, name));
        const codeMods = (await Promise.all(
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
        const wsFolders = await connectionService.connection().workspace.getWorkspaceFolders();
        if (wsFolders) {
            const codemodDir = connectionService.getSettings().codemodDir;
            for (let folder of wsFolders) {
                const folderUri = Uri.parse(folder.uri);
                if (folderUri.scheme !== 'file') {
                    continue;
                }

                const dirName = path.join(folderUri.fsPath, codemodDir);
                if (!(await fs.pathExists(dirName))) {
                    continue;
                }

                const names = await fs.readdir(dirName);
                for (let n of names) {
                    const fn = path.join(dirName, n);
                    if ((await fs.stat(fn)).isFile) {
                        codeMods.push(this._parseCodeModFile(fn));
                    }
                }
            }
        }
        const validCodeMods = codeMods.filter(c => c) as CodeModDefinition[];
        validCodeMods.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
        this._codeModsCache = validCodeMods;
        logService.output(`${validCodeMods.length} code actions loaded.`);
        return validCodeMods;
    }

    public loadOneEmbeddedCodeMod(modId: string): void {
        const fileName = path.join(embeddedCodeModDir, modId);
        const mod = this._parseCodeModFile(fileName);
        if (!mod) {
            throw new Error(`Failed to load the codeMod ${modId} (file: ${fileName}).`);
        }
        if (!this._codeModsCache) {
            this._codeModsCache = [];
        }
        this._codeModsCache.push(mod);
    }

    public async getGlobalMods(options: {
        languageId: LanguageId;
        fileName: string;
        source: string;
        selection: Selection;
    }) {
        const mods = (await this._getAllCodeMods()).filter(mod => {
            if (!mod) {
                return false;
            }
            if (mod.scope !== CodeModScope.Global) {
                return false;
            }
            try {
                return this.executeCanRun(mod.id, options);
            } catch (e) {
                logService.outputError(`Error while executing ${mod.id}.canRun(): ${e.toString()}`);
                return false;
            }
        });
        return mods;
    }

    public async getCodeActionMods(options: {
        languageId: LanguageId;
        fileName: string;
        source: string;
        selection: Selection;
    }) {
        const mods = await this._getAllCodeMods();
        return mods.filter(mod => {
            if (mod.scope !== CodeModScope.Cursor) {
                return false;
            }
            try {
                return this.executeCanRun(mod.id, options);
            } catch (e) {
                logService.outputError(`Error while executing ${mod.id}.canRun(): ${e.toString()}`);
                return false;
            }
        });
    }

    public executeCanRun(
        modId: string,
        options: {
            languageId: LanguageId;
            fileName: string;
            source: string;
            selection: Selection;
        }
    ) {
        const mod = this._getCodeMod(modId);
        const jscodeshift = astService.getCodeShift(options.languageId);
        const ast = astService.getAstTree(options);
        if (!ast) {
            return false;
        }
        const target = ast.findNodeAtPosition(options.selection.active);
        return mod.canRun(
            {
                path: options.fileName,
                source: options.source,
                ast
            },
            {
                jscodeshift,
                stats: () => {}
            },
            {
                target,
                selection: options.selection
            }
        );
    }

    public executeTransform(
        modId: string,
        options: {
            languageId: LanguageId;
            fileName: string;
            source: string;
            selection: Selection;
        }
    ): string {
        const mod = this._getCodeMod(modId);
        const jscodeshift = astService.getCodeShift(options.languageId);
        const ast = astService.getAstTree(options);
        if (!ast) {
            throw new Error('Syntax error');
        }
        const target = ast.findNodeAtPosition(options.selection.active);
        let result;
        result = mod.modFn(
            {
                path: options.fileName,
                source: options.source,
                ast
            },
            {
                jscodeshift,
                stats: () => {}
            },
            {
                target,
                selection: options.selection
            }
        );
        astService.invalidateAstTree(options.fileName);
        if (!result) {
            return options.source;
        }
        return result;
    }

    private _parseCodeModFile(fileName: string): CodeModDefinition | null {
        let modFn: CodeModExports;
        try {
            modFn = require(fileName);
        } catch (e) {
            logService.outputError(`Failed to parse codemod '${fileName}': ${e.message}`);
            return null;
        }
        const name = path.basename(fileName, path.extname(fileName));
        return {
            id: name,
            name: modFn.title || name,
            description: modFn.description || '',
            detail: modFn.detail,
            canRun: modFn.canRun || (() => true),
            scope: (modFn.scope as CodeModScope) || CodeModScope.Global,
            modFn
        };
    }

    private async _getAllCodeMods(): Promise<CodeModDefinition[]> {
        if (this._codeModsCache) {
            return this._codeModsCache;
        }
        await this.reloadAllCodeMods();
        return this._codeModsCache!;
    }

    private _getCodeMod(modId: string): CodeModDefinition {
        const mod = this._codeModsCache && this._codeModsCache.find(m => m.id === modId);
        if (!mod) {
            throw new Error(`The requested mod ${modId} is missing in cache.`);
        }
        return mod;
    }
}

export default new CodeModService();
