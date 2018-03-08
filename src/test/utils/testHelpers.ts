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

/* eslint-disable import/no-extraneous-dependencies */

'use strict';

import * as uniq from 'lodash/uniq';
import { CodeModExports } from '../../models/CodeMod';
import codeModService from '../../services/codeModService';
import * as vscode from 'vscode';
import * as assert from 'assert';
import * as fs from 'fs-extra';
import * as path from 'path';
import { Position, IPosition } from '../../utils';

function toVsPosition(pos: IPosition) {
    return new vscode.Position(pos.line - 1, pos.column - 1);
}

function getSelection(options: { pos?: IPosition; startPos?: IPosition; endPos?: IPosition }) {
    let startPos;
    let endPos;
    if (options.pos) {
        startPos = toVsPosition(options.pos);
        endPos = toVsPosition(options.pos);
    } else if (options.startPos) {
        startPos = toVsPosition(options.startPos);
        endPos = toVsPosition(options.endPos);
    } else {
        startPos = new vscode.Position(0, 0);
        endPos = new vscode.Position(0, 0);
    }
    return {
        startPos,
        endPos
    };
}

export function runInlineTransformTest(
    modId: string,
    input: string,
    output: string,
    options: { fileName?: string; pos?: IPosition; startPos?: IPosition; endPos?: IPosition } = {}
) {
    const mod = codeModService.loadOneEmbeddedCodeMod(modId);

    const runOptions = {
        fileName:
            (options && options.fileName) || '/Users/billy/projects/example/codemods/example.ts',
        source: input,
        selection: getSelection(options)
    };

    const canRun = codeModService.executeCanRun(mod, runOptions);
    if (!canRun) {
        throw new Error('The transform cannot be run at this position.');
    }
    const actualOutput = codeModService.executeTransform(mod, runOptions);

    assert.equal(actualOutput, output);
}

export function runInlineCanRunTest(
    modId: string,
    input: string,
    expected: boolean,
    options: { fileName?: string; pos?: IPosition; startPos?: IPosition; endPos?: IPosition } = {}
) {
    const mod = codeModService.loadOneEmbeddedCodeMod(modId);

    const runOptions = {
        fileName:
            (options && options.fileName) || '/Users/billy/projects/example/codemods/example.ts',
        source: input,
        selection: getSelection(options)
    };

    const actualOutput = codeModService.executeCanRun(mod, runOptions);
    assert.equal(actualOutput, expected);
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
    const posDef = eval('(' + match[1] + ')');
    if (!Number.isFinite(posDef.pos)) {
        throw new Error(`Invalid 'pos' definition in positional comment:\n"${source}"`);
    }
    const column: number = posDef.pos;
    const line: number = source.split('\n').findIndex(line => line.includes(match[0])) + 1;

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
    fallbackFixtureName?: string,
    searchPosition: boolean = true
) {
    const re = /\/\*\$\s*([^\$]+?)\s*\$\*\//g;
    let match;
    interface FixtureRawDef {
        raw: any;
        name: string;
        inputStart: number;
        inputEnd: number;
    }
    let fixtures: FixtureRawDef[] = [];
    let activeFixture: FixtureRawDef | undefined;
    while ((match = re.exec(input)) !== null) {
        let fixtureDef;
        try {
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
    let fullFixtures = fixtures.map(fx => {
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
            pos = extractPosition(modId, fallbackFixtureName || null, source);
            source = pos.source;
        } else {
            pos = new Position(1, 1);
        }
        fullFixtures.push({
            raw: {},
            name: fallbackFixtureName || null,
            source,
            pos
        });
    }
    return fullFixtures;
}

export function defineTransformTests(
    dirName: string,
    modId: string,
    fixtureId: string | null = null,
    options: { fileName?: string; pos?: IPosition; startPos?: IPosition; endPos?: IPosition } = {}
) {
    const fixDir = path.join(dirName, '__fixtures__');
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
                runInlineTransformTest(modId, fx.source, outputFx.source, {
                    fileName: options.fileName,
                    pos: fx.pos
                });
            });
        });
    });
}

export function defineCanRunTests(
    dirName: string,
    modId: string,
    expected: boolean | null = null,
    fixtureId: string | null = null,
    options: { fileName?: string; pos?: IPosition; startPos?: IPosition; endPos?: IPosition } = {}
) {
    const fixDir = path.join(dirName, '__fixtures__');
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
                runInlineCanRunTest(modId, fx.source, expected, {
                    fileName: options.fileName,
                    pos: fx.pos
                });
            });
        });
    });
}

export function defineCodeModTests(dirName: string) {
    const fixDir = path.join(dirName, '__fixtures__');
    const files = fs.readdirSync(fixDir);
    const modIds = uniq(files.map(f => f.substring(0, f.indexOf('.'))));

    modIds.forEach(modId => {
        defineCanRunTests(dirName, modId);
        defineTransformTests(dirName, modId);
    });
}
