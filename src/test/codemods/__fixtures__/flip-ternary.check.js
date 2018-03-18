/*$ { fixture: 'should-trigger', expected: true } $*/

const a = 1;
const b = 2;

const c = a > b ? a : b; /*# { pos: 17 } #*/

/*$ { fixture: 'should-not-trigger', expected: false } $*/

const a = 1;
const b = 2;

const c = a > b ? a : b; /*# { pos: 7 } #*/
