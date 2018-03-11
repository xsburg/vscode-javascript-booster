import { assertSmartSelectionExtend } from '../utils/smartSelectionHelpers';

suite(`Smart selection: extend`, () => {
    test('Identifier', () => {
        const before = `
            let fo|ob|ar;
        `;
        const after = `
            let |asdasdasd|;
        `;
        //assertSmartSelectionExtend(before, after);
    });
});
