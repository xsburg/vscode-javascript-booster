/*$ { fixture: 'should-trigger-at-declaration', expected: true } $*/

const a = 'foo', b = 'bar'; /*# { pos: 3 } #*/

/*$ { fixture: 'should-trigger-at-declarator', expected: true } $*/

const a = 'foo', b = 'bar'; /*# { pos: 14 } #*/

/*$ { fixture: 'should-not-trigger', expected: false } $*/

const a = 'foo'; /*# { pos: 12 } #*/
