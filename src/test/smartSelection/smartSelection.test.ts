import { assertSmartSelectionExtend } from '../utils/smartSelectionHelpers';

suite(`Smart selection: extend`, () => {
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

    test('should extend to whole node: Identifier', () => {
        const before = `
            let fo|ob|ar;
        `;
        const after = `
            let |foobar|;
        `;
        assertSmartSelectionExtend(before, after);
    });

    test('should extend to brackets within node: [ ]', () => {
        const before = `
            let array = [
                |'foo',
                'bar'|
            ];
        `;
        const after = `
            let array = [|
                'foo',
                'bar'
            |];
        `;
        assertSmartSelectionExtend(before, after);
    });

    test('should extend to whole node: [ ]', () => {
        const before = `
            let array = [|
                'foo',
                'bar'
            |];
        `;
        const after = `
            let array = |[
                'foo',
                'bar'
            ]|;
        `;
        assertSmartSelectionExtend(before, after);
    });

    test('should extend to whole node 2: [ ]', () => {
        const before = `
            let array = |[
                'foo',
                'ba|r'
            ];
        `;
        const after = `
            let array = |[
                'foo',
                'bar'
            ]|;
        `;
        assertSmartSelectionExtend(before, after);
    });

    test('should extend to brackets within node: {} if', () => {
        const before = `
            if (true) {
                |let a;
                let b;|
            }
        `;
        const after = `
            if (true) {|
                let a;
                let b;
            |}
        `;
        assertSmartSelectionExtend(before, after);
    });

    test('should extend to brackets within node: {} object', () => {
        const before = `
            let obj = {
                |foo: 'foo',
                bar: 'bar'|
            };
        `;
        const after = `
            let obj = {|
                foo: 'foo',
                bar: 'bar'
            |};
        `;
        assertSmartSelectionExtend(before, after);
    });

    test('should extend to siblings: object properties', () => {
        const before = `
            let obj = {
                |foo: 'foo'|,
                bar: 'bar'
            };
        `;
        const after = `
            let obj = {
                |foo: 'foo',
                bar: 'bar'|
            };
        `;
        assertSmartSelectionExtend(before, after);
    });

    test('should extend to siblings: statements', () => {
        const before = `
            function test() {
                let a;
                |let b;|
                let c;
            }
        `;
        const after = `
            function test() {
                |let a;
                let b;
                let c;|
            }
        `;
        assertSmartSelectionExtend(before, after);
    });
});
