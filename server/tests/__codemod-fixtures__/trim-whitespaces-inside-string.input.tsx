/*$ { fixture: 'should-trim-whitespaces' } $*/

// @ts-nocheck

let s = ' \n  foobar'; /*# { pos: 16 } #*/

/*$ { fixture: 'should-preserve-escape-chars' } $*/

let s = ' \n  foo\tbar'; /*# { pos: 16 } #*/
