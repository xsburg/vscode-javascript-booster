/*$ { fixture: 'should-trigger-at-literal', expected: true } $*/

const a = 'foo'; /*# { pos: 14 } #*/

/*$ { fixture: 'should-trigger-at-binary-expr', expected: true } $*/

const a = 'foo';
const b = a + 'bar'; /*# { pos: 12 } #*/

/*$ { fixture: 'should-trigger-at-ternary-expr', expected: true } $*/

const a = 'foo';
const b = 'bar';
const b = a + b + 'baz'; /*# { pos: 12 } #*/

/*$ { fixture: 'should-not-trigger-when-no-literal', expected: false } $*/

const a = 'foo';
const b = 'bar';
const b = a + b; /*# { pos: 12 } #*/
