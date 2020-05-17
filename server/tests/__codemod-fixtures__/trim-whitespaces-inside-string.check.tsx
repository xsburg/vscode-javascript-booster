/*$ { fixture: 'should-trigger-with-whitespace-chars', expected: true } $*/

// @ts-nocheck

let s = '\n   foobar'; /*# { pos: 16 } #*/

/*$ { fixture: 'should-not-trigger-without-whitespaces', expected: false } $*/

let s = 'foo bar'; /*# { pos: 16 } #*/
