/*$ { fixture: 'should-split-into-two' } $*/

const a = 'foo' + 'bar';

/*$ { fixture: 'should-split-corner-case-start' } $*/

const a = '' + 'foo';

/*$ { fixture: 'should-split-corner-case-end' } $*/

const a = 'foo' + '';

/*$ { fixture: 'should-handle-escape-characters' } $*/

const a = 'foo\xA9\n' + 'bar';

/*$ { fixture: 'should-handle-non-standard-symbols' } $*/

const a = '\ud83c\udf36foo🌶' + 'bar';

/*$ { fixture: 'should-break-unicode-sequence-shamelessly' } $*/

const a = '\ud8' + '3c\udf36foo';

/*$ { fixture: 'should-handle-new-line' } $*/

const a = 'foo\
' + 'bar';

/*$ { fixture: 'should-push-escape-sign-to-right-part' } $*/

const a = 'foo' + '\nbar';

/*$ { fixture: 'should-escape-escape-symbol-at-begin-and-end' } $*/

const a = 'foo' + 'bar';

/*$ { fixture: 'should-avoid-parens-when-splitting-inside-expression' } $*/

const a = 'foo' + 'bar' + 'baz';
