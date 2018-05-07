"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs-extra");
const path = require("path");
const CodeMod_1 = require("../models/CodeMod");
const astService_1 = require("./astService");
const logService_1 = require("./logService");
const embeddedCodeModDir = path.join(__dirname, '..', 'codemods');
class CodeModService {
    constructor() {
        this._codeModsCache = null;
    }
    reloadAllCodeMods() {
        return __awaiter(this, void 0, void 0, function* () {
            // local code mods
            const files = yield fs.readdir(embeddedCodeModDir);
            const fileNames = files.map(name => path.join(embeddedCodeModDir, name));
            const codeMods = (yield Promise.all(fileNames.map((fileName) => __awaiter(this, void 0, void 0, function* () {
                if (!fileName.match(/(\.ts|\.js)$/)) {
                    return {
                        isFile: false,
                        fileName
                    };
                }
                const stat = yield fs.lstat(fileName);
                return {
                    isFile: stat.isFile(),
                    fileName
                };
            }))))
                .filter(x => x.isFile)
                .map(x => this._parseCodeModFile(x.fileName));
            // user-workspace code mods
            /* const config = vscode.workspace.getConfiguration(extensionId);
            const codemodDir = config.get(configIds.codemodDir);
            if (vscode.workspace.name) {
                const uris = await vscode.workspace.findFiles(`${codemodDir}/*.{ts,js}`);
                codeMods.push(...uris.map(uri => this._parseCodeModFile(uri.fsPath)));
            } */
            const validCodeMods = codeMods.filter(c => c);
            validCodeMods.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
            this._codeModsCache = validCodeMods;
            logService_1.default.output(`${validCodeMods.length} code actions loaded.`);
            return validCodeMods;
        });
    }
    loadOneEmbeddedCodeMod(modId) {
        const fileName = path.join(embeddedCodeModDir, modId);
        return this._parseCodeModFile(fileName);
    }
    getGlobalMods(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const mods = (yield this._getAllCodeMods()).filter(mod => {
                if (!mod) {
                    return false;
                }
                if (mod.scope !== CodeMod_1.CodeModScope.Global) {
                    return false;
                }
                try {
                    return this.executeCanRun(mod, options);
                }
                catch (e) {
                    logService_1.default.outputError(`Error while executing ${mod.id}.canRun(): ${e.toString()}`);
                    return false;
                }
            });
            return mods;
        });
    }
    getCodeActionMods(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const mods = yield this._getAllCodeMods();
            return mods.filter(mod => {
                if (mod.scope !== CodeMod_1.CodeModScope.Cursor) {
                    return false;
                }
                try {
                    return this.executeCanRun(mod, options);
                }
                catch (e) {
                    logService_1.default.outputError(`Error while executing ${mod.id}.canRun(): ${e.toString()}`);
                    return false;
                }
            });
        });
    }
    executeCanRun(mod, options) {
        const jscodeshift = astService_1.default.getCodeShift(options.languageId);
        const ast = astService_1.default.getAstTree(options);
        if (!ast) {
            return false;
        }
        const target = ast.findNodeAtPosition(options.selection.active);
        return mod.canRun({
            path: options.fileName,
            source: options.source,
            ast
        }, {
            jscodeshift,
            stats: () => { }
        }, {
            target
        });
    }
    executeTransform(mod, options) {
        const jscodeshift = astService_1.default.getCodeShift(options.languageId);
        const ast = astService_1.default.getAstTree(options);
        if (!ast) {
            throw new Error('Syntax error');
        }
        const target = ast.findNodeAtPosition(options.selection.active);
        let result;
        result = mod.modFn({
            path: options.fileName,
            source: options.source,
            ast
        }, {
            jscodeshift,
            stats: () => { }
        }, {
            target
        });
        astService_1.default.invalidateAstTree(options.fileName);
        if (!result) {
            return options.source;
        }
        return result;
    }
    _parseCodeModFile(fileName) {
        let modFn;
        try {
            modFn = require(fileName);
        }
        catch (e) {
            logService_1.default.outputError(`Failed to parse codemod '${fileName}: ${e.message}'`);
            return null;
        }
        const name = path.basename(fileName, path.extname(fileName));
        return {
            id: name,
            name: modFn.title || name,
            description: modFn.description || '',
            detail: modFn.detail,
            canRun: modFn.canRun || (() => true),
            scope: modFn.scope || CodeMod_1.CodeModScope.Global,
            modFn
        };
    }
    _getAllCodeMods() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._codeModsCache) {
                return this._codeModsCache;
            }
            yield this.reloadAllCodeMods();
            return this._codeModsCache;
        });
    }
}
exports.default = new CodeModService();
//# sourceMappingURL=codeModService.js.map