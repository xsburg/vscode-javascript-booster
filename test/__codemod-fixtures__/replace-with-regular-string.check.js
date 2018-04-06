/*$ { fixture: 'should-trigger-at-template-literal', expected: true } $*/

const a = `foo`; /*# { pos: 14 } #*/

/*$ { fixture: 'should-trigger-at-template-with-expressions', expected: true } $*/

const a = 'foo';
const b = `${foo}bar`; /*# { pos: 16 } #*/

/*$ { fixture: 'should-not-trigger-otherwise', expected: false } $*/

const a = 'foo'; /*# { pos: 7 } #*/
