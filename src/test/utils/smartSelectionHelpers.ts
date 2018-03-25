import * as assert from 'assert';
import * as os from 'os';
import astService, { LanguageId, Selection } from '../../services/astService';
import smartSelectionService from '../../services/smartSelectionService';

function extractSelections(code: string): Selection[] {
    let normalizedCode = code.replace(/\r?\n/g, os.EOL);
    // anchor - always at the start
    // active - always at the end
    const anchor = normalizedCode.indexOf('|');
    normalizedCode = normalizedCode.replace('|', '');
    let active = normalizedCode.lastIndexOf('|');
    if (active === -1) {
        active = anchor;
    }

    return {
        anchor,
        active
    };
}

function removeSelectionMarkers(code: string) {
    return code.replace('|', '').replace('|', '');
}

function applySelectionMarkers(code: string, selections: Selection[]) {
    let start = selection.anchor;
    let end = selection.active;
    if (selection.active < selection.anchor) {
        [start, end] = [end, start];
    }
    const result =
        start === end
            ? [code.substring(0, start), code.substring(end)]
            : [code.substring(0, start), code.substring(start, end), code.substring(end)];
    return result.join('|');
}

/**
 * Extracts /*# { action: '+/-' } #*\/ comment to determine smart action. Defaults to EXTEND if not found.
 */
function extractAction(text: string) {
    const re = /\/\*#\s*([^#]+?)\s*#\*\//g;
    const reClean = /\s*\/\*#\s*([^#]+?)\s*#\*\//g;
    const match = re.exec(text);
    if (!match || !match[0]) {
        return {
            text,
            action: true
        };
    }
    // tslint:disable-next-line:no-eval
    const posDef = eval('(' + match[1] + ')');
    const action: string = posDef.action;
    const cleanSource = text.replace(reClean, '');

    return {
        text: cleanSource,
        action: action !== '-'
    };
}

export function assertSmartSelection(
    inputFixture: string,
    outputFixture: string,
    languageId: LanguageId = 'javascriptreact'
) {
    const extractedData1 = extractAction(inputFixture);
    const extractedData2 = extractAction(outputFixture);
    inputFixture = extractedData1.text.trim();
    outputFixture = extractedData2.text.trim();
    const inputSelections = extractSelections(inputFixture);
    const expectedSelections = extractSelections(outputFixture);
    const cleanInputFixture = removeSelectionMarkers(inputFixture);
    const cleanOutputFixture = removeSelectionMarkers(inputFixture);
    assert.equal(
        cleanInputFixture,
        cleanOutputFixture,
        'Source code in input and output fixtures must be the same.'
    );
    const ast = astService.getAstTree({
        languageId,
        fileName: 'example.jsx',
        source: cleanInputFixture
    });
    if (!ast) {
        throw new Error('SyntaxError in input fixture.');
    }

    let actualSelections;
    if (extractedData1.action) {
        actualSelections = smartSelectionService.extendSelection({
            languageId,
            source: cleanInputFixture,
            fileName: 'example.js',
            ast,
            selections: inputSelections
        });
    } else {
        actualSelections = smartSelectionService.shrinkSelection({
            languageId,
            source: cleanInputFixture,
            fileName: 'example.js',
            ast,
            selections: inputSelections
        });
    }

    const actualOutputFixture = applySelectionMarkers(cleanInputFixture, actualSelections);
    assert.equal(actualOutputFixture, outputFixture, `Input fixture: ${inputFixture}`);
}

export function assertSmartSelectionBulk(
    fixtures: string[],
    languageId: LanguageId = 'javascriptreact'
) {
    for (let i = 0; i < fixtures.length - 1; i++) {
        const input = fixtures[i];
        const output = fixtures[i + 1];
        assertSmartSelection(input, output, languageId);
    }
}
