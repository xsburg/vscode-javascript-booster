import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs-extra';
import * as jscodeshift from 'jscodeshift';
import { CodeModDefinition, CodeModExports, CodeModScope } from '../models/CodeMod';
import { Position } from '../utils/Position';
import { Program, AstNode } from 'ast-types';
import { configIds, extensionId } from '../const';
import { registerCollectionExtensions } from '../utils';
import logService from './logService';

// Hack to adjust default recast options
// making it as close to Prettier as possible.
const CollectionPrototype = jscodeshift.withParser('babylon')('').constructor.prototype;
const toSource = CollectionPrototype.toSource;
CollectionPrototype.toSource = function(options) {
    return toSource.call(this, {
        quote: 'single',
        ...options
    });
};

registerCollectionExtensions(jscodeshift as jscodeshift.JsCodeShift);

export type LanguageId = 'javascript' | 'javascriptreact' | 'typescript' | 'typescriptreact';

const supportedLanguages: LanguageId[] = [
    'javascript',
    'javascriptreact',
    'typescript',
    'typescriptreact'
];

const codeshifts: { [languageId in LanguageId]: jscodeshift.JsCodeShift } = {
    javascript: jscodeshift.withParser('babylon'),
    javascriptreact: jscodeshift.withParser('babylon'),
    typescript: jscodeshift.withParser('typescript'),
    typescriptreact: jscodeshift.withParser('tsx')
};

const embeddedCodeModDir = path.join(__dirname, '..', 'codemods');

// Zero-based offset
interface Selection {
    startPos: number;
    endPos: number;
}

interface AstCache {
    source: string;
    ast: jscodeshift.Collection<Program>;
    modsByPosition: Map<number, CodeModDefinition[]>;
    modsByTarget: Map<AstNode, CodeModDefinition[]>;
}

class CodeModService {
    // cached by fileName
    private _astCache: Map<string, AstCache> = new Map();

    private _codeModsCache: CodeModDefinition[] | null = null;

    private _getCodeShift(languageId: LanguageId, fileName: string) {
        return codeshifts[languageId];
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

    public isSupportedLanguage(languageId: string): boolean {
        return supportedLanguages.indexOf(languageId as any) !== -1;
    }

    public offsetAt(document: vscode.TextDocument, pos: vscode.Position) {
        const input = document.getText();
        let offset = 0;
        let lines = input
            .split('\r')
            .join('')
            .split('\n');
        let prevLines = lines.slice(0, pos.line);
        offset += prevLines.map(l => l.length + 1).reduce((s, a) => s + a, 0);
        offset += pos.character;
        return offset;
    }

    constructor() {}

    public async reloadAllCodeMods(): Promise<CodeModDefinition[]> {
        this._invalidateAstTreeCache();
        // local code mods
        const files = await fs.readdir(embeddedCodeModDir);
        const fileNames = files.map(name => path.join(embeddedCodeModDir, name));
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

    public loadOneEmbeddedCodeMod(modId: string) {
        const fileName = path.join(embeddedCodeModDir, modId);
        return this._parseCodeModFile(fileName);
    }

    public async getGlobalMods() {
        const mods = (await this._getAllCodeMods()).filter(
            mod => mod.scope === CodeModScope.Global
        );
        return mods;
    }

    public async getCodeActionMods(options: {
        languageId: LanguageId;
        fileName: string;
        source: string;
        selection: Selection;
    }): Promise<CodeModDefinition[]> {
        console.log(new Date().toISOString(), 'getCodeActionMods');
        const jscodeshift = this._getCodeShift(options.languageId, options.fileName);
        const pos = options.selection.startPos;
        let astCache = this._astCache.get(options.fileName);

        // Level 1: AST cache
        if (!astCache) {
            astCache = {
                source: options.source,
                ast: jscodeshift(options.source) as jscodeshift.Collection<Program>,
                modsByTarget: new Map(),
                modsByPosition: new Map()
            };
        }

        // Level 2: cache by position
        let mods = astCache.modsByPosition.get(pos);
        if (mods) {
            return mods;
        }

        // Level 3: cache by target node
        const target = astCache.ast.findNodeAtPosition(options.selection.startPos);
        const targetNode = target.firstNode();
        mods = astCache.modsByTarget.get(targetNode);
        if (mods) {
            // update cache
            astCache.modsByPosition.set(pos, mods);
            return mods;
        }

        if (targetNode) {
            const allMods = await this._getAllCodeMods();
            mods = allMods.filter(mod => {
                if (mod.scope !== CodeModScope.Cursor) {
                    return false;
                }
                try {
                    return this.executeCanRun(mod, options);
                } catch (e) {
                    logService.outputError(
                        `Error while executing ${mod.id}.canRun(): ${e.toString()}`
                    );
                    return false;
                }
            });
        } else {
            mods = [];
        }
        astCache.modsByPosition.set(pos, mods);
        astCache.modsByTarget.set(targetNode, mods);
        return mods;
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
        const jscodeshift = this._getCodeShift(options.languageId, options.fileName);
        const ast = this._getAstTreeCache(options);
        const target = ast.findNodeAtPosition(options.selection.startPos);
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
        const jscodeshift = this._getCodeShift(options.languageId, options.fileName);
        const ast = this._getAstTreeCache(options);
        const target = ast.findNodeAtPosition(options.selection.startPos);
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
        this._invalidateAstTreeCache(options.fileName);
        if (!result) {
            return options.source;
        }
        return result;
    }

    private _getAstTreeCache(options: {
        languageId: LanguageId;
        fileName: string;
        source: string;
    }) {
        const cache = this._astCache.get(options.fileName);
        if (cache && cache.source === options.source) {
            return cache.ast;
        }
        const ast = this._getCodeShift(options.languageId, options.fileName)(
            options.source
        ) as jscodeshift.Collection<Program>;
        this._astCache.set(options.fileName, {
            source: options.source,
            ast,
            modsByPosition: new Map(),
            modsByTarget: new Map()
        });
        return ast;
    }

    private _invalidateAstTreeCache(fileName?: string) {
        if (!fileName) {
            this._astCache.clear();
            return;
        }
        const cache = this._astCache.get(fileName);
        if (cache) {
            this._astCache.delete(fileName);
        }
    }
}

export default new CodeModService();
