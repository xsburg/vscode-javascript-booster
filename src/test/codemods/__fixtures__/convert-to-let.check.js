/*$ { fixture: 'should-trigger-on-var', expected: true } $*/

var a = 'foo'; /*# { pos: 3 } #*/

/*$ { fixture: 'should-trigger-on-const', expected: true } $*/

const a = 'foo'; /*# { pos: 3 } #*/

/*$ { fixture: 'should-not-trigger', expected: false } $*/

var a = 'foo'; /*# { pos: 12 } #*/
