/*$ { fixture: 'should-trigger', expected: true } $*/

var a = 'foo'; /*# { pos: 3 } #*/

/*$ { fixture: 'should-not-trigger', expected: false } $*/

var a = 'foo'; /*# { pos: 12 } #*/
