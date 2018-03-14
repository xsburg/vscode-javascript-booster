import { File, Program } from 'ast-types';
import * as fs from 'fs-extra';
import * as os from 'os';
import * as path from 'path';
import * as vscode from 'vscode';
import { configIds, extensionId } from '../const';
import { CodeModDefinition, CodeModExports, CodeModScope } from '../models/CodeMod';
import { Position } from '../utils/Position';
import astService, { LanguageId, Selection } from './astService';
import logService from './logService';

const embeddedCodeModDir = path.join(__dirname, '..', 'codemods');

class CodeModService {
    private _codeModsCache: CodeModDefinition[] | null = null;

    public async reloadAllCodeMods(): Promise<CodeModDefinition[]> {
        // local code mods
        const files = await fs.readdir(embeddedCodeModDir);
        const fileNames = files.map(name => path.join(embeddedCodeModDir, name));
        let codeMods = (await Promise.all(
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
        if (vscode.workspace.name) {
            const uris = await vscode.workspace.findFiles(`${codemodDir}/*.{ts,js}`);
            codeMods.push(...uris.map(uri => this._parseCodeModFile(uri.fsPath)));
        }
        codeMods = codeMods.filter(c => c);
        codeMods.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
        this._codeModsCache = codeMods;
        logService.output(`${codeMods.length} code actions loaded.`);
        return codeMods;
    }

    public loadOneEmbeddedCodeMod(modId: string) {
        const fileName = path.join(embeddedCodeModDir, modId);
        return this._parseCodeModFile(fileName);
    }

    public async getGlobalMods(options: {
        languageId: LanguageId;
        fileName: string;
        source: string;
        selection: Selection;
    }) {
        const mods = (await this._getAllCodeMods()).filter(mod => {
            if (mod.scope !== CodeModScope.Global) {
                return false;
            }
            try {
                return this.executeCanRun(mod, options);
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
                return this.executeCanRun(mod, options);
            } catch (e) {
                logService.outputError(`Error while executing ${mod.id}.canRun(): ${e.toString()}`);
                return false;
            }
        });
    }

    public executeCanRun(
        mod: CodeModDefinition,
        options: {
            languageId: LanguageId;
            fileName: string;
            source: string;
            selection: Selection;
        }
    ) {
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
                target
            }
        );
    }

    public executeTransform(
        mod: CodeModDefinition,
        options: {
            languageId: LanguageId;
            fileName: string;
            source: string;
            selection: Selection;
        }
    ): string {
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
                target
            }
        );
        astService.invalidateAstTree(options.fileName);
        if (!result) {
            return options.source;
        }
        return result;
    }

    private _parseCodeModFile(fileName: string): CodeModDefinition {
        let modFn: CodeModExports;
        try {
            modFn = require(fileName);
        } catch (e) {
            logService.outputError(`Failed to parse codemod '${fileName}: ${e.message}'`);
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

    private async _getAllCodeMods() {
        if (this._codeModsCache) {
            return this._codeModsCache;
        }
        await this.reloadAllCodeMods();
        return this._codeModsCache;
    }
}

export default new CodeModService();
