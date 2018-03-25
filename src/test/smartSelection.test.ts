import * as assert from 'assert';
import {
    applySelectionMarkers,
    assertSmartSelection,
    assertSmartSelectionBulk,
    extractSelections,
    removeSelectionMarkers
} from './utils/smartSelectionHelpers';

suite(`Smart selection`, () => {
    test('helpers should extract single selection position', () => {
        const before = `
            let a = 'content is a sen|te|nce';
        `;
        const actualSelections = extractSelections(before);
        const after = applySelectionMarkers(removeSelectionMarkers(before), actualSelections);
        assert.equal(after, before);
    });

    test('helpers should extract multiple selection position', () => {
        const before = `
            let a = 'content is a sen|1|te|1|nce';
            let b = 'content is a sen|2|te|2|nce';
        `;
        const actualSelections = extractSelections(before);
        const after = applySelectionMarkers(removeSelectionMarkers(before), actualSelections);
        assert.equal(after, before);
    });

    test('helpers should extract selection from 0 offset', () => {
        const before = '|const company = selectors.company.getCompanyById(state, d.companyId);|';
        const actualSelections = extractSelections(before);
        const after = applySelectionMarkers(removeSelectionMarkers(before), actualSelections);
        assert.equal(after, before);
    });

    test('helpers should extract selection from 0 offset', () => {
        const before = 'const company = selectors.company.|getCompanyById|(state, d.companyId);';
        const actualSelections = extractSelections(before);
        assert.equal(actualSelections.length, 1);
        assert.equal(actualSelections[0].anchor, 34);
        assert.equal(actualSelections[0].active, 48);
    });

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

    test('should extend multiple selections to Identifier', () => {
        const before = `
            const company1 = selectors.company.getCo|1|mpa|1|nyById(state, d.companyId);
            const company2 = selectors.company.getCo|2|mpa|2|nyById(state, d.companyId);
        `;
        const after = `
            const company1 = selectors.company.|1|getCompanyById|1|(state, d.companyId);
            const company2 = selectors.company.|2|getCompanyById|2|(state, d.companyId);
        `;
        assertSmartSelection(before, after);
    });

    test('should shrink when have passed a sequence of extensions', () => {
        assertSmartSelectionBulk([
            `
                /*# { action: '+' } #*/
                const company = selectors.company.|1|getCompanyById|1|(state, d.companyId);
                const company = |2|selectors.company.getCompanyById|2|(state, d.companyId);
            `,
            `
                /*# { action: '+' } #*/
                const company = |1|selectors.company.getCompanyById|1|(state, d.companyId);
                const company = |2|selectors.company.getCompanyById(state, d.companyId)|2|;
            `,
            `
                /*# { action: '-' } #*/
                const company = |1|selectors.company.getCompanyById(state, d.companyId)|1|;
                const |2|company = selectors.company.getCompanyById(state, d.companyId)|2|;
            `,
            `
                /*# { action: '-' } #*/
                const company = |1|selectors.company.getCompanyById|1|(state, d.companyId);
                const company = |2|selectors.company.getCompanyById(state, d.companyId)|2|;
            `,
            `
                /*# { action: '-' } #*/
                const company = selectors.company.|1|getCompanyById|1|(state, d.companyId);
                const company = |2|selectors.company.getCompanyById|2|(state, d.companyId);
            `,
            `
                const company = selectors.company.getCompanyById|1|(state, d.companyId);
                const company = selectors.company.getCompanyById|2|(state, d.companyId);
            `
        ]);
    });
});
