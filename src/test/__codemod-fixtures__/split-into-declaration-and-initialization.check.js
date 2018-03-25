/*$ { fixture: 'should-trigger-at-declaration', expected: true } $*/

let a = 'foo', b = 'bar'; /*# { pos: 3 } #*/

/*$ { fixture: 'should-trigger-at-declarator', expected: true } $*/

let b = 'bar'; /*# { pos: 12 } #*/

/*$ { fixture: 'should-trigger-at-const-as-well', expected: true } $*/

const a = 'foo'; /*# { pos: 12 } #*/

/*$ { fixture: 'should-not-trigger-when-no-init', expected: false } $*/

let a; /*# { pos: 5 } #*/
