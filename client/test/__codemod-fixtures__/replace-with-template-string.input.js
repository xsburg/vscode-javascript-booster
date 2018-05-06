/*$ { fixture: 'should-convert-literal' } $*/

const a = 'foo'; /*# { pos: 14 } #*/

/*$ { fixture: 'should-convert-var' } $*/

const a = 'bar';
const b = 'foo' + a; /*# { pos: 14 } #*/

/*$ { fixture: 'should-convert-miltiple-right-vars' } $*/

const a = 'foo';
const b = 'bar';
const c = 'baz' + b + a; /*# { pos: 14 } #*/

/*$ { fixture: 'should-convert-miltiple-left-vars' } $*/

const a = 'foo';
const b = 'bar';
const c = a + b + 'baz'; /*# { pos: 21 } #*/

/*$ { fixture: 'should-interpret-braces' } $*/

const a = 'foo';
const b = 'bar';
const c = (a + b) + 'baz'; /*# { pos: 21 } #*/

/*$ { fixture: 'should-handle-two-literal-expressions' } $*/

const a = 'foo';
const test = 'Hello' + ',' + a; /*# { pos: 26 } #*/
