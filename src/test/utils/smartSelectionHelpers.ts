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

export function assertSmartSelectionExtend(
    beforeCode: string,
    afterCode: string,
    languageId: LanguageId = 'javascriptreact'
) {
    const inputSelection = extractSelection(beforeCode);
    const expectedSelection = extractSelection(afterCode);
    const ast = astService.getAstTree({
        languageId,
        fileName: 'example.jsx',
        source: removeSelectionMarkers(beforeCode)
    });
    const actualSelection = smartSelectionService.extendSelection(languageId, ast, inputSelection);
    assert.equal(actualSelection.anchor, expectedSelection.anchor);
    assert.equal(actualSelection.active, expectedSelection.active);
}

export function assertSmartSelectionShrink(beforeCode: string, afterCode: string) {}
