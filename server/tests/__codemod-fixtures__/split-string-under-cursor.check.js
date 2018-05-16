/*$ { fixture: 'should-trigger-when-at-string-literal', expected: true } $*/

const a = 'foo'; /*# { pos: 14 } #*/

/*$ { fixture: 'should-not-trigger', expected: false } $*/

const a = 1; /*# { pos: 2 } #*/
