import { assertSmartSelection, assertSmartSelectionBulk } from '../utils/smartSelectionHelpers';

suite(`Smart selection: extend`, () => {
    test('should extend to word', () => {
        const before = `
            let a = 'content is a sen|te|nce';
        `;
        const after = `
            let a = 'content is a |sentence|';
        `;
        assertSmartSelection(before, after);
    });

    test('should extend to string value', () => {
        const before = `
            let a = 'content is a |sentence|';
        `;
        const after = `
            let a = '|content is a sentence|';
        `;
        assertSmartSelection(before, after);
    });

    test('should extend to string literal', () => {
        const before = `
            let a = '|content is a sentence|';
        `;
        const after = `
            let a = |'content is a sentence'|;
        `;
        assertSmartSelection(before, after);
    });

    test('should extend to string literal 2', () => {
        const before = `
            let a = 'cont|ent is a sentence'|;
        `;
        const after = `
            let a = |'content is a sentence'|;
        `;
        assertSmartSelection(before, after);
    });

    test('should extend to whole node: Identifier', () => {
        const before = `
            let fo|ob|ar;
        `;
        const after = `
            let |foobar|;
        `;
        assertSmartSelection(before, after);
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
        assertSmartSelection(before, after);
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
        assertSmartSelection(before, after);
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
        assertSmartSelection(before, after);
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
        assertSmartSelection(before, after);
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
        assertSmartSelection(before, after);
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
        assertSmartSelection(before, after);
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
        assertSmartSelection(before, after);
    });

    test('should extend to CallExpression brackets', () => {
        const before = `
            let result = object.property(
                |var1,
                var2|
            );
        `;
        const after = `
            let result = object.property|(
                var1,
                var2
            )|;
        `;
        assertSmartSelection(before, after);
    });

    test('should extend to FunctionDeclaration brackets', () => {
        const before = `
            function test(
                |foo,
                bar|) {
            }
        `;
        const after = `
            function test|(
                foo,
                bar)| {
            }
        `;
        assertSmartSelection(before, after);
    });

    test('should extend from MemberExpression identifier to the left', () => {
        const before = `
            const company = selectors.company.|getCompanyById|(state, d.companyId);
        `;
        const after = `
            const company = |selectors.company.getCompanyById|(state, d.companyId);
        `;
        assertSmartSelection(before, after);
    });

    test('should extend from JSXOpenElement when tag is collapsed', () => {
        const before = `
            const company = <div>|<div />|</div>;
        `;
        const after = `
            const company = |<div><div /></div>|;
        `;
        assertSmartSelection(before, after);
    });

    test('should shrink when have passed a sequence of extensions', () => {
        assertSmartSelectionBulk([
            'const company = selectors.company.getCo|mpany|ById(state, d.companyId); /*# { action: `+` } #*/',
            'const company = selectors.company.|getCompanyById|(state, d.companyId); /*# { action: `+` } #*/',
            'const company = |selectors.company.getCompanyById|(state, d.companyId); /*# { action: `+` } #*/',
            'const company = |selectors.company.getCompanyById(state, d.companyId)|; /*# { action: `+` } #*/',
            'const |company = selectors.company.getCompanyById(state, d.companyId)|; /*# { action: `+` } #*/',
            '|const company = selectors.company.getCompanyById(state, d.companyId);| /*# { action: `-` } #*/',
            'const |company = selectors.company.getCompanyById(state, d.companyId)|; /*# { action: `-` } #*/',
            'const company = |selectors.company.getCompanyById(state, d.companyId)|; /*# { action: `-` } #*/',
            'const company = |selectors.company.getCompanyById|(state, d.companyId); /*# { action: `-` } #*/',
            'const company = selectors.company.|getCompanyById|(state, d.companyId); /*# { action: `-` } #*/',
            'const company = selectors.company.getCo|mpany|ById(state, d.companyId); /*# { action: `-` } #*/',
            'const company = selectors.company.getCompany|ById(state, d.companyId);'
        ]);
    });
});
