import * as fs from 'fs-extra';
import * as _ from 'lodash';
import * as os from 'os';
import * as path from 'path';
import * as vscode from 'vscode-languageserver-types';

import astService, { LanguageId } from '../../src/services/astService';
import codeModService from '../../src/services/codeModService';
import { IPosition, Position } from '../../src/utils/Position';

function toZeroBasedPosition(pos: IPosition) {
    return vscode.Position.create(pos.line - 1, pos.column - 1);
}

function toOffsetFromStart(input: string, posOneBased: IPosition): number {
    const pos = toZeroBasedPosition(posOneBased);
    let offset = 0;
    const lines = input.split('\n');
    const prevLines = lines.slice(0, pos.line);
    offset += prevLines.map((l) => l.length + os.EOL.length).reduce((s, a) => s + a, 0);
    offset += pos.character;
    return offset;
}

function getSelection(options: { input: string; anchor?: IPosition; active: IPosition }) {
    return {
        anchor: toOffsetFromStart(options.input, options.anchor || options.active),
        active: toOffsetFromStart(options.input, options.active),
    };
}

function normalizeLineEndings(text: string) {
    return text.split('\r').join('');
}

async function runInlineTransformTest(
    languageId: LanguageId,
    modId: string,
    input: string,
    output: {
        source: string;
        selection?: {
            anchor?: IPosition;
            active: IPosition;
        };
    },
    options: {
        fileName?: string;
        anchor?: IPosition;
        active: IPosition;
    }
) {
    input = normalizeLineEndings(input);
    const expectedOutput = normalizeLineEndings(output.source);

    const runOptions = {
        languageId,
        fileName:
            (options && options.fileName) || '/Users/billy/projects/example/codemods/example.ts',
        source: input,
        selection: getSelection({
            input,
            anchor: options.anchor,
            active: options.active,
        }),
        include: [modId],
    };

    const canRun = (await codeModService.getRunnableCodeMods(runOptions)).length === 1;
    if (!canRun) {
        throw new Error('The transform cannot be run at this position.');
    }
    let result = codeModService.executeTransform(modId, runOptions);
    const actualOutput = normalizeLineEndings(result.source);

    // Wrong result in execute()
    expect(actualOutput).toBe(expectedOutput);

    if (output.selection) {
        // execute() must return new selection
        expect(result.selection).toBeTruthy();
        const actualActivePos = Position.fromZeroBased(
            astService.positionAt(result.source, result.selection!.active)
        );
        const actualAnchorPos = Position.fromZeroBased(
            astService.positionAt(result.source, result.selection!.anchor)
        );
        const expectedActivePos = new Position(
            output.selection.active.line,
            output.selection.active.column
        );
        const expectedAnchorPos = output.selection.anchor || expectedActivePos;
        // Wrong output selection
        expect(actualActivePos).toEqual(expectedActivePos);
        expect(actualAnchorPos).toEqual(expectedAnchorPos);
    }
}

async function runInlineCanRunTest(
    languageId: LanguageId,
    modId: string,
    input: string,
    expected: boolean,
    options: { fileName?: string; anchor?: IPosition; active: IPosition }
) {
    const runOptions = {
        languageId,
        fileName: (options && options.fileName) || '/Users/example/example.ts',
        source: input,
        selection: getSelection({
            input,
            anchor: options.anchor,
            active: options.active,
        }),
        include: [modId],
    };

    const actualCanRun = (await codeModService.getRunnableCodeMods(runOptions)).length === 1;
    // canRun test fail
    expect(actualCanRun).toBe(expected);
}

function getLanguageIdByFileName(fileName: string): LanguageId {
    const extensionMap: Array<{
        extensions: string;
        parser: LanguageId;
    }> = [
        {
            extensions: '.js,.es,.es6',
            parser: 'javascript',
        },
        {
            extensions: '.jsx',
            parser: 'javascriptreact',
        },
        {
            extensions: '.ts',
            parser: 'typescript',
        },
        {
            extensions: '.tsx',
            parser: 'typescriptreact',
        },
    ];
    const fileExt = path.extname(fileName);
    const def = extensionMap.find((x) => x.extensions.split(',').indexOf(fileExt) !== -1);
    if (!def) {
        throw new Error(`Failed to match file extension of file '${fileName}' to languageId.`);
    }
    return def.parser;
}

/*
    Extracts position from a json comment, example:
    /* { pos: 1 [,nextLine: true]  } *\/
    /* { activePos: 1 [,nextLine: true]  } *\/
    /* { anchorPos: 1 [,nextLine: true]  } *\/
 */
function extractPosition(
    modId: string,
    source: string
): { source: string; pos: { anchor: IPosition; active: IPosition } } | null {
    function extractPosInternal(posKey: string) {
        const re = /\/\*#\s*([^#]+?)\s*#\*\//g;
        let match: RegExpExecArray | null;
        // tslint:disable-next-line:no-conditional-assignment
        while ((match = re.exec(source)) !== null) {
            if (!match[0]) {
                continue;
            }
            // tslint:disable-next-line:no-eval
            const posDef = eval('(' + match[1] + ')');
            if (posDef[posKey]) {
                let pos1 = posDef[posKey];
                if (!Number.isFinite(pos1)) {
                    throw new Error(`Invalid 'pos' definition in positional comment:\n"${source}"`);
                }
                const column: number = pos1;
                let line: number = source.split('\n').findIndex((l) => l.includes(match![0])) + 1;
                if (posDef.nextLine) {
                    line++;
                }
                return {
                    line,
                    column,
                };
            }
        }
        return null;
    }

    let anchorPos = extractPosInternal('anchorPos');
    let activePos = extractPosInternal('activePos');
    const pos = extractPosInternal('pos');
    if (!(anchorPos && activePos)) {
        if (!pos) {
            return null;
        } else {
            activePos = pos;
            anchorPos = {
                line: pos.line,
                column: pos.column,
            };
        }
    }

    const reClean = /\s*\/\*#\s*([^#]+?)\s*#\*\//g;
    let cleanSource = source.replace(reClean, '');
    while (cleanSource.startsWith('\n')) {
        cleanSource = cleanSource.substring(1);
        anchorPos.line--;
        activePos.line--;
    }

    return {
        source: cleanSource,
        pos: {
            anchor: anchorPos,
            active: activePos,
        },
    };
}

function extractFixtures(
    modId: string,
    input: string,
    fallbackFixtureName: string | null = null,
    hasPosition: boolean = true
) {
    const re = /\/\*\$\s*([^\$]+?)\s*\$\*\//g; // /*$ VALUE $*/
    let match;
    interface FixtureRawDef {
        raw: any;
        name: string;
        skip?: boolean;
        validateOutPos?: boolean;
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
            skip: fixtureDef.skip,
            validateOutPos: fixtureDef.validateOutPos,
            inputStart: re.lastIndex,
            inputEnd: input.length,
        };
    }
    if (activeFixture) {
        fixtures.push(activeFixture);
    }
    const fullFixtures: Array<{
        raw: any;
        name: string | null;
        validateOutPos: boolean;
        skip: boolean;
        source: string;
        pos: {
            anchor: IPosition;
            active: IPosition;
        };
    }> = fixtures.map((fx) => {
        const inputFragment = input.substring(fx.inputStart, fx.inputEnd);
        let source = inputFragment.trim();
        let posInfo = extractPosition(modId, source);
        if (posInfo) {
            source = posInfo.source;
        }
        if (!posInfo && (hasPosition || fx.validateOutPos)) {
            throw new Error(
                `[${modId}][${
                    fx.name || ''
                }] Position is not provided, use '/*# { position: columnNumber[, nextLine: true] } #*/'`
            );
        }

        return {
            raw: fx.raw,
            name: fx.name,
            validateOutPos: Boolean(fx.validateOutPos),
            skip: fx.skip || false,
            source,
            pos: posInfo
                ? posInfo.pos
                : {
                      anchor: new Position(1, 1),
                      active: new Position(1, 1),
                  },
        };
    });
    if (fullFixtures.length === 0) {
        let source = input.trim();
        let posInfo = extractPosition(modId, source);
        if (posInfo) {
            source = posInfo.source;
        }
        if (!posInfo && hasPosition) {
            throw new Error(
                `[${modId}][${fallbackFixtureName}] Position is not provided, use '/*# { position: columnNumber[, nextLine: true] } #*/'`
            );
        }

        fullFixtures.push({
            raw: {},
            name: fallbackFixtureName,
            validateOutPos: false,
            skip: false,
            source,
            pos: posInfo
                ? posInfo.pos
                : {
                      anchor: new Position(1, 1),
                      active: new Position(1, 1),
                  },
        });
    }
    return fullFixtures;
}

function posToString(pos: { anchor: IPosition; active: IPosition }) {
    if (pos.active.column === pos.anchor.column && pos.active.line === pos.anchor.line) {
        return `pos ${pos.active.line}:${pos.active.column}`;
    } else {
        return `pos ${pos.anchor.line}:${pos.anchor.column}->${pos.active.line}:${pos.active.column}`;
    }
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
    const inputFile = files.find((file) => file.startsWith(`${modId}${fixtureSuffix}.input.`));
    const outputFile = files.find((file) => file.startsWith(`${modId}${fixtureSuffix}.output.`));
    if (!inputFile || !outputFile) {
        throw new Error(
            `Failed to find input or output fixture. modId: '${modId}', fixtureId: ${fixtureId}.`
        );
    }
    const input = fs.readFileSync(path.join(fixDir, inputFile), 'utf8');
    const output = fs.readFileSync(path.join(fixDir, outputFile), 'utf8');

    const inputFixtures = extractFixtures(modId, input, fixtureId, true);
    const outputFixtures = extractFixtures(modId, output, fixtureId, false);

    describe(`${modId} transform`, () => {
        inputFixtures.forEach((fx) => {
            const testName = fx.name
                ? `"${modId}:${fx.name}" transforms correctly (${posToString(fx.pos)})`
                : `"${modId}" transforms correctly (${posToString(fx.pos)})`;
            const outputFx = outputFixtures.find((x) => x.name === fx.name);
            if (!outputFx) {
                throw new Error(`Failed to find output data for fixture ${fx.name}, mod ${modId}.`);
            }
            const fn = fx.skip ? it.skip : it;
            fn(testName, async () => {
                await runInlineTransformTest(
                    getLanguageIdByFileName(inputFile),
                    modId,
                    fx.source,
                    {
                        source: outputFx.source,
                        selection: outputFx.validateOutPos
                            ? {
                                  active: outputFx.pos.active,
                                  anchor: outputFx.pos.anchor,
                              }
                            : undefined,
                    },
                    {
                        fileName: options.fileName,
                        active: fx.pos.active,
                        anchor: fx.pos.anchor,
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
    const inputFile = files.find((file) => file.startsWith(`${modId}${fixtureSuffix}.check.`));
    if (!inputFile) {
        throw new Error(
            `Failed to find the input fixture for canRun() test. modId: '${modId}', fixtureId: ${fixtureId}.`
        );
    }
    const input = fs.readFileSync(path.join(fixDir, inputFile), 'utf8');
    const inputFixtures = extractFixtures(modId, input, fixtureId, true);

    describe(`${modId} can run`, () => {
        inputFixtures.forEach((fx) => {
            if (typeof fx.raw.expected !== 'boolean') {
                throw new Error(
                    `Invalid type of 'expected' property in fixture ${fx.name}, mod ${modId}.`
                );
            }
            const expected: boolean = fx.raw.expected;
            const testName = fx.name
                ? `"${modId}:${fx.name}" ${expected ? 'can' : 'cannot'} run (${posToString(
                      fx.pos
                  )})`
                : `"${modId}" ${expected ? 'can' : 'cannot'} run (${posToString(fx.pos)})`;
            const fn = fx.skip ? it.skip : it;
            fn(testName, async () => {
                await runInlineCanRunTest(
                    getLanguageIdByFileName(inputFile),
                    modId,
                    fx.source,
                    expected,
                    {
                        fileName: options.fileName,
                        active: fx.pos.active,
                        anchor: fx.pos.anchor,
                    }
                );
            });
        });
    });
}

export function defineCodeModTests(dirName: string) {
    const fixDir = path.join(dirName, '__codemod-fixtures__');
    const files = fs.readdirSync(fixDir);
    const modIds = _.uniq(files.map((f) => f.substring(0, f.indexOf('.'))));

    modIds.forEach((modId) => {
        defineCanRunTests(dirName, modId);
        defineTransformTests(dirName, modId);
    });
}
