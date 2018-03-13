import { assertSmartSelectionExtend } from '../utils/smartSelectionHelpers';

suite(`Smart selection: extend`, () => {
    test('should extend to Identifier', () => {
        const before = `
            let fo|ob|ar;
        `;
        const after = `
            let |foobar|;
        `;
        assertSmartSelectionExtend(before, after);
    });

    test('should extend to word', () => {
        const before = `
            let a = 'content is a sen|te|nce';
        `;
        const after = `
            let a = 'content is a |sentence|';
        `;
        assertSmartSelectionExtend(before, after);
    });

    test('should extend to string value', () => {
        const before = `
            let a = 'content is a |sentence|';
        `;
        const after = `
            let a = '|content is a sentence|';
        `;
        assertSmartSelectionExtend(before, after);
    });

    test('should extend to string literal', () => {
        const before = `
            let a = '|content is a sentence|';
        `;
        const after = `
            let a = |'content is a sentence'|;
        `;
        assertSmartSelectionExtend(before, after);
    });

    test('should extend to string literal 2', () => {
        const before = `
            let a = 'cont|ent is a sentence'|;
        `;
        const after = `
            let a = |'content is a sentence'|;
        `;
        assertSmartSelectionExtend(before, after);
    });
});
