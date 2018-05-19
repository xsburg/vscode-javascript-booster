/*$ { fixture: 'should-split-into-two' } $*/

const a = 'foobar'; /*# { pos: 15 } #*/

/*$ { fixture: 'should-split-corner-case-start' } $*/

const a = 'foo'; /*# { pos: 12 } #*/

/*$ { fixture: 'should-split-corner-case-end' } $*/

const a = 'foo'; /*# { pos: 15 } #*/

/*$ { fixture: 'should-handle-escape-characters' } $*/

const a = 'foo\xA9\nbar'; /*# { pos: 21 } #*/

/*$ { fixture: 'should-handle-non-standard-symbols' } $*/

const a = '\ud83c\udf36foo🌶bar'; /*# { pos: 29 } #*/

/*$ { fixture: 'should-break-unicode-sequence-shamelessly' } $*/

const a = '\ud83c\udf36foo'; /*# { pos: 18 } #*/

/*$ { fixture: 'should-handle-new-line' } $*/

const a = 'foo\
bar'; /*# { pos: 1 } #*/

/*$ { fixture: 'should-push-escape-sign-to-right-part' } $*/

const a = 'foo\nbar'; /*# { pos: 16 } #*/

/*$ { fixture: 'should-escape-escape-symbol-at-begin-and-end' } $*/

/*# { pos: 16, nextLine: true } #*/
const a = 'foo\
bar';

/*$ { fixture: 'should-avoid-parens-when-splitting-inside-expression' } $*/

const a = 'foo' + 'barbaz'; /*# { pos: 23 } #*/
