/**
 * Developer: Stepan Burguchev
 * Date: 11/16/2017
 * Copyright: 2015-present ApprovalMax
 *       All Rights Reserved
 *
 * THIS IS UNPUBLISHED PROPRIETARY SOURCE CODE OF ApprovalMax
 *       The copyright notice above does not evidence any
 *       actual or intended publication of such source code.
 */

import * as assert from 'assert';
import * as fs from 'fs-extra';
import * as _ from 'lodash';
import * as os from 'os';
import * as path from 'path';
import * as vscode from 'vscode';

import { LanguageId } from '../../services/astService';
import codeModService from '../../services/codeModService';
import { IPosition, Position } from '../../utils';

function toZeroBasedPosition(pos: IPosition) {
    return new vscode.Position(pos.line - 1, pos.column - 1);
}

function toOffsetFromStart(input: string, posOneBased: IPosition): number {
    const pos = toZeroBasedPosition(posOneBased);
    let offset = 0;
    const lines = input.split('\n');
    const prevLines = lines.slice(0, pos.line);
    offset += prevLines.map(l => l.length + os.EOL.length).reduce((s, a) => s + a, 0);
    offset += pos.character;
    return offset;
}

function getSelection(options: { input: string; anchor?: IPosition; active: IPosition }) {
    return {
        anchor: toOffsetFromStart(options.input, options.anchor || options.active),
        active: toOffsetFromStart(options.input, options.active)
    };
}

function normalizeLineEndings(text: string) {
    return text.split('\r').join('');
}

function runInlineTransformTest(
    languageId: LanguageId,
    modId: string,
    input: string,
    output: string,
    options: { fileName?: string; anchor?: IPosition; active: IPosition }
) {
    input = normalizeLineEndings(input);
    output = normalizeLineEndings(output);
    const mod = codeModService.loadOneEmbeddedCodeMod(modId);
    if (!mod) {
        throw new Error(`Failed to load code mod ${modId}. Syntax error.`);
    }

    const runOptions = {
        languageId,
        fileName:
            (options && options.fileName) || '/Users/billy/projects/example/codemods/example.ts',
        source: input,
        selection: getSelection({
            input,
            anchor: options.anchor,
            active: options.active
        })
    };

    const canRun = codeModService.executeCanRun(mod, runOptions);
    if (!canRun) {
        throw new Error('The transform cannot be run at this position.');
    }
    let actualOutput = codeModService.executeTransform(mod, runOptions);
    actualOutput = normalizeLineEndings(actualOutput);

    assert.equal(actualOutput, output);
}

function runInlineCanRunTest(
    languageId: LanguageId,
    modId: string,
    input: string,
    expected: boolean,
    options: { fileName?: string; anchor?: IPosition; active: IPosition }
) {
    const mod = codeModService.loadOneEmbeddedCodeMod(modId);
    if (!mod) {
        throw new Error(`Failed to load code mod ${modId}. Syntax error.`);
    }

    const runOptions = {
        languageId,
        fileName:
            (options && options.fileName) || '/Users/billy/projects/example/codemods/example.ts',
        source: input,
        selection: getSelection({
            input,
            anchor: options.anchor,
            active: options.active
        })
    };

    const actualOutput = codeModService.executeCanRun(mod, runOptions);
    assert.equal(actualOutput, expected);
}

function getLanguageIdByFileName(fileName: string): LanguageId {
    const extensionMap: Array<{
        extensions: string;
        parser: LanguageId;
    }> = [
        {
            extensions: '.js,.es,.es6',
            parser: 'javascript'
        },
        {
            extensions: '.jsx',
            parser: 'javascriptreact'
        },
        {
            extensions: '.ts',
            parser: 'typescript'
        },
        {
            extensions: '.tsx',
            parser: 'typescriptreact'
        }
    ];
    const fileExt = path.extname(fileName);
    const def = extensionMap.find(x => x.extensions.split(',').indexOf(fileExt) !== -1);
    if (!def) {
        throw new Error(`Failed to match file extension of file '${fileName}' to languageId.`);
    }
    return def.parser;
}

function extractPosition(
    modId: string,
    fixtureId: string | null,
    source: string
): IPosition & { source: string } {
    const re = /\/\*#\s*([^#]+?)\s*#\*\//g;
    const reClean = /\s*\/\*#\s*([^#]+?)\s*#\*\//g;
    const match = re.exec(source);
    if (!match || !match[0]) {
        throw new Error(
            `[${modId}][${fixtureId ||
                ''}] Position is not provided, use '/*# { position: columnNumber } #*/'`
        );
    }
    // tslint:disable-next-line:no-eval
    const posDef = eval('(' + match[1] + ')');
    if (!Number.isFinite(posDef.pos)) {
        throw new Error(`Invalid 'pos' definition in positional comment:\n"${source}"`);
    }
    const column: number = posDef.pos;
    const line: number = source.split('\n').findIndex(l => l.includes(match[0])) + 1;

    const cleanSource = source.replace(reClean, '');

    return {
        source: cleanSource,
        line,
        column
    };
}

function extractFixtures(
    modId: string,
    input: string,
    fallbackFixtureName: string | null = null,
    searchPosition: boolean = true
) {
    const re = /\/\*\$\s*([^\$]+?)\s*\$\*\//g; // /*$ VALUE $*/
    let match;
    interface FixtureRawDef {
        raw: any;
        name: string;
        inputStart: number;
        inputEnd: number;
    }
    const fixtures: FixtureRawDef[] = [];
    let activeFixture: FixtureRawDef | undefined;
    // tslint:disable-next-line:no-conditional-assignment
    while ((match = re.exec(input)) !== null) {
        let fixtureDef;
        try {
            // tslint:disable-next-line:no-eval
            fixtureDef = eval('(' + match[1] + ')');
        } catch (e) {
            throw new Error(`[${modId}] Failed to parse inline fixture definition.`);
        }
        if (activeFixture) {
            activeFixture.inputEnd = re.lastIndex - match[0].length;
            fixtures.push(activeFixture);
        }
        activeFixture = {
            raw: fixtureDef,
            name: fixtureDef.fixture as string,
            inputStart: re.lastIndex,
            inputEnd: input.length
        };
    }
    if (activeFixture) {
        fixtures.push(activeFixture);
    }
    const fullFixtures: Array<{
        raw: any;
        name: string | null;
        source: string;
        pos: IPosition;
    }> = fixtures.map(fx => {
        const inputFragment = input.substring(fx.inputStart, fx.inputEnd);
        let source = inputFragment.trim();
        let pos;
        if (searchPosition) {
            pos = extractPosition(modId, fx.name, source);
            source = pos.source;
        } else {
            pos = new Position(1, 1);
        }
        return {
            raw: fx.raw,
            name: fx.name,
            source,
            pos
        };
    });
    if (fullFixtures.length === 0) {
        let source = input.trim();
        let pos;
        if (searchPosition) {
            pos = extractPosition(modId, fallbackFixtureName, source);
            source = pos.source;
        } else {
            pos = new Position(1, 1);
        }
        fullFixtures.push({
            raw: {},
            name: fallbackFixtureName,
            source,
            pos
        });
    }
    return fullFixtures;
}

function defineTransformTests(
    dirName: string,
    modId: string,
    fixtureId: string | null = null,
    options: { fileName?: string; pos?: IPosition; startPos?: IPosition; endPos?: IPosition } = {}
) {
    const fixDir = path.join(dirName, '__codemod-fixtures__');
    const fixtureSuffix = fixtureId ? `.${fixtureId}` : '';
    const files = fs.readdirSync(fixDir);
    const inputFile = files.find(file => file.startsWith(`${modId}${fixtureSuffix}.input.`));
    const outputFile = files.find(file => file.startsWith(`${modId}${fixtureSuffix}.output.`));
    if (!inputFile || !outputFile) {
        throw new Error(
            `Failed to find input or output fixture. modId: '${modId}', fixtureId: ${fixtureId}.`
        );
    }
    const input = fs.readFileSync(path.join(fixDir, inputFile), 'utf8');
    const output = fs.readFileSync(path.join(fixDir, outputFile), 'utf8');

    const inputFixtures = extractFixtures(modId, input, fixtureId, true);
    const outputFixtures = extractFixtures(modId, output, fixtureId, false);

    suite(`${modId} transform`, () => {
        inputFixtures.forEach(fx => {
            const testName = fx.name
                ? `"${modId}:${fx.name}" transforms correctly (pos ${fx.pos.line}:${fx.pos.column})`
                : `"${modId}" transforms correctly (pos ${fx.pos.line}:${fx.pos.column})`;
            const outputFx = outputFixtures.find(x => x.name === fx.name);
            if (!outputFx) {
                throw new Error(`Failed to find output data for fixture ${fx.name}, mod ${modId}.`);
            }
            test(testName, () => {
                runInlineTransformTest(
                    getLanguageIdByFileName(inputFile),
                    modId,
                    fx.source,
                    outputFx.source,
                    {
                        fileName: options.fileName,
                        active: fx.pos
                    }
                );
            });
        });
    });
}

function defineCanRunTests(
    dirName: string,
    modId: string,
    fixtureId: string | null = null,
    options: { fileName?: string; pos?: IPosition; startPos?: IPosition; endPos?: IPosition } = {}
) {
    const fixDir = path.join(dirName, '__codemod-fixtures__');
    const fixtureSuffix = fixtureId ? `.${fixtureId}` : '';
    const files = fs.readdirSync(fixDir);
    const inputFile = files.find(file => file.startsWith(`${modId}${fixtureSuffix}.check.`));
    if (!inputFile) {
        throw new Error(
            `Failed to find the input fixture for canRun() test. modId: '${modId}', fixtureId: ${fixtureId}.`
        );
    }
    const input = fs.readFileSync(path.join(fixDir, inputFile), 'utf8');
    const inputFixtures = extractFixtures(modId, input, fixtureId, true);

    suite(`${modId} can run`, () => {
        inputFixtures.forEach(fx => {
            if (typeof fx.raw.expected !== 'boolean') {
                throw new Error(
                    `Invalid type of 'expected' property in fixture ${fx.name}, mod ${modId}.`
                );
            }
            const expected: boolean = fx.raw.expected;
            const testName = fx.name
                ? `"${modId}:${fx.name}" ${expected ? 'can' : 'cannot'} run (pos ${fx.pos.line}:${
                      fx.pos.column
                  })`
                : `"${modId}" ${expected ? 'can' : 'cannot'} run (pos ${fx.pos.line}:${
                      fx.pos.column
                  })`;
            test(testName, () => {
                runInlineCanRunTest(
                    getLanguageIdByFileName(inputFile),
                    modId,
                    fx.source,
                    expected,
                    {
                        fileName: options.fileName,
                        active: fx.pos
                    }
                );
            });
        });
    });
}

export function defineCodeModTests(dirName: string) {
    const fixDir = path.join(dirName, '__codemod-fixtures__');
    const files = fs.readdirSync(fixDir);
    const modIds = _.uniq(files.map(f => f.substring(0, f.indexOf('.'))));

    modIds.forEach(modId => {
        defineCanRunTests(dirName, modId);
        defineTransformTests(dirName, modId);
    });
}
