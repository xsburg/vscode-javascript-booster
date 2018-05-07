import { File } from 'ast-types';
import * as jscodeshift from 'jscodeshift';
import * as os from 'os';
import { PrinterOptions } from 'recast';
import * as vscode from 'vscode-languageserver-types';
import { registerCollectionExtensions } from '../utils';
import logService from './logService';

// Hack to adjust default recast options
// making it as close to Prettier as possible.

// tslint:disable-next-line:variable-name
const CollectionPrototype = jscodeshift.withParser('babylon')('').constructor.prototype;
const toSource = CollectionPrototype.toSource;
CollectionPrototype.toSource = function(options: PrinterOptions) {
    return toSource.call(this, {
        quote: 'single',
        ...options
    });
};

registerCollectionExtensions(jscodeshift as jscodeshift.JsCodeShift);

// Zero-based offset
export interface Selection {
    anchor: number;
    active: number;
}

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

export type AstRoot = jscodeshift.Collection<File>;

class AstService {
    public readonly supportedlanguages = supportedLanguages;

    private _astCache: Map<
        string, // cached by fileName
        {
            source: string;
            ast: AstRoot | null;
        }
    > = new Map();

    public isSupportedLanguage(languageId: string): boolean {
        return supportedLanguages.indexOf(languageId as any) !== -1;
    }

    public getCodeShift(languageId: LanguageId) {
        return codeshifts[languageId];
    }

    /**
     * Compute zero-based offset for `Position` in the way Babylon parser does it.
     * All new-line sequences are normalized to \r\n for Win and \n for Linux and
     * therefore treated as 1 or 2 characters depending on the OS.
     * @param document
     * @param pos
     */
    public offsetAt(text: string, pos: vscode.Position) {
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

    public normalizedText(text: string) {
        return text.replace(/\r?\n/g, os.EOL);
    }

    /**
     * Compute Position for zero-based offset provided by Babylon.
     * @param document
     * @param offset
     */
    public positionAt(text: string, offset: number): vscode.Position {
        const lines = text.replace(/\r?\n/g, os.EOL).split(os.EOL);

        // TODO fixme
        return {} as any;
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
    public getAstTree(options: {
        languageId: LanguageId;
        fileName: string;
        source: string;
    }): AstRoot | null {
        const cache = this._astCache.get(options.fileName);
        if (cache && cache.source === options.source) {
            return cache.ast;
        }
        const codeshift = this.getCodeShift(options.languageId);
        let ast: AstRoot | null = null;
        try {
            ast = codeshift(options.source) as AstRoot;
        } catch (e) {
            if (e.name === 'SyntaxError') {
                logService.output(
                    `Syntax error in file ${options.fileName} (${e.loc.line}:${e.loc.column}).`
                );
            } else {
                logService.output(
                    `Unknown error in file ${options.fileName}. \nError from Babylon Parser: ${
                        e.message
                    }.`
                );
            }
        }
        this._astCache.set(options.fileName, {
            source: options.source,
            ast
        });
        return ast;
    }

    public invalidateAstTree(fileName: string) {
        const cache = this._astCache.get(fileName);
        if (cache) {
            this._astCache.delete(fileName);
        }
    }
}

export default new AstService();
