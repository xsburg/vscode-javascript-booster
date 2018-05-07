"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jscodeshift = require("jscodeshift");
const os = require("os");
const utils_1 = require("../utils");
const logService_1 = require("./logService");
// Hack to adjust default recast options
// making it as close to Prettier as possible.
// tslint:disable-next-line:variable-name
const CollectionPrototype = jscodeshift.withParser('babylon')('').constructor.prototype;
const toSource = CollectionPrototype.toSource;
CollectionPrototype.toSource = function (options) {
    return toSource.call(this, Object.assign({ quote: 'single' }, options));
};
utils_1.registerCollectionExtensions(jscodeshift);
const supportedLanguages = [
    'javascript',
    'javascriptreact',
    'typescript',
    'typescriptreact'
];
const codeshifts = {
    javascript: jscodeshift.withParser('babylon'),
    javascriptreact: jscodeshift.withParser('babylon'),
    typescript: jscodeshift.withParser('typescript'),
    typescriptreact: jscodeshift.withParser('tsx')
};
class AstService {
    constructor() {
        this.supportedlanguages = supportedLanguages;
        this._astCache = new Map();
    }
    isSupportedLanguage(languageId) {
        return supportedLanguages.indexOf(languageId) !== -1;
    }
    getCodeShift(languageId) {
        return codeshifts[languageId];
    }
    /**
     * Compute zero-based offset for `Position` in the way Babylon parser does it.
     * All new-line sequences are normalized to \r\n for Win and \n for Linux and
     * therefore treated as 1 or 2 characters depending on the OS.
     * @param document
     * @param pos
     */
    offsetAt(text, pos) {
        let offset = 0;
        const lines = text
            .split('\r')
            .join('')
            .split('\n');
        const prevLines = lines.slice(0, pos.line);
        const eolLength = os.EOL.length;
        offset += prevLines.map(l => l.length + eolLength).reduce((s, a) => s + a, 0);
        offset += pos.character;
        return offset;
    }
    normalizedText(text) {
        return text.replace(/\r?\n/g, os.EOL);
    }
    /**
     * Compute Position for zero-based offset provided by Babylon.
     * @param document
     * @param offset
     */
    positionAt(text, offset) {
        const lines = text.replace(/\r?\n/g, os.EOL).split(os.EOL);
        // TODO fixme
        return {};
        /* let activeOffset = 0;
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            if (activeOffset + line.length >= offset) {
                return new vscode.Position(i, offset - activeOffset);
            }
            activeOffset += line.length + os.EOL.length;
        }
        return new vscode.Position(0, 0); */
    }
    /**
     * @returns AstRoot or null if the source code is invalid
     */
    getAstTree(options) {
        const cache = this._astCache.get(options.fileName);
        if (cache && cache.source === options.source) {
            return cache.ast;
        }
        const codeshift = this.getCodeShift(options.languageId);
        let ast = null;
        try {
            ast = codeshift(options.source);
        }
        catch (e) {
            if (e.name === 'SyntaxError') {
                logService_1.default.output(`Syntax error in file ${options.fileName} (${e.loc.line}:${e.loc.column}).`);
            }
            else {
                logService_1.default.output(`Unknown error in file ${options.fileName}. \nError from Babylon Parser: ${e.message}.`);
            }
        }
        this._astCache.set(options.fileName, {
            source: options.source,
            ast
        });
        return ast;
    }
    invalidateAstTree(fileName) {
        const cache = this._astCache.get(fileName);
        if (cache) {
            this._astCache.delete(fileName);
        }
    }
}
exports.default = new AstService();
//# sourceMappingURL=astService.js.map