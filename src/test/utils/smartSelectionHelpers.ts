import * as assert from 'assert';
import * as os from 'os';
import astService, { Selection, LanguageId } from '../../services/astService';
import smartSelectionService from '../../services/smartSelectionService';

function extractSelection(code: string): Selection {
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

function applySelectionMarkers(code: string, selection: Selection) {
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

export function assertSmartSelectionExtend(
    inputFixture: string,
    outputFixture: string,
    languageId: LanguageId = 'javascriptreact'
) {
    inputFixture = inputFixture.trim();
    outputFixture = outputFixture.trim();
    const inputSelection = extractSelection(inputFixture);
    const expectedSelection = extractSelection(outputFixture);
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
    const actualSelection = smartSelectionService.extendSelection(languageId, ast, inputSelection);
    const actualOutputFixture = applySelectionMarkers(cleanInputFixture, actualSelection);
    assert.equal(actualOutputFixture, outputFixture, `Input fixture: ${inputFixture}`);
}

export function assertSmartSelectionShrink(beforeCode: string, afterCode: string) {}
