/*$ { fixture: 'should-trigger-at-declaration', expected: true } $*/

let a = 'foo', b = 'bar'; /*# { pos: 3 } #*/

/*$ { fixture: 'should-trigger-at-declarator', expected: true } $*/

let b = 'bar'; /*# { pos: 12 } #*/

/*$ { fixture: 'should-not-trigger-at-const', expected: false } $*/

const a = 'foo'; /*# { pos: 12 } #*/
