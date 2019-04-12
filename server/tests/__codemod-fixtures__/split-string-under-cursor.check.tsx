/*$ { fixture: 'should-trigger-when-at-string-literal', expected: true } $*/

const a = 'foo'; /*# { pos: 14 } #*/

/*$ { fixture: 'should-not-trigger', expected: false } $*/

const a = 1; /*# { pos: 2 } #*/

/*$ { fixture: 'should-not-trigger-when-at-start-quote', expected: false } $*/

const a = 'foo' /*# { pos: 11 } #*/

/*$ { fixture: 'should-not-trigger-when-at-end-quote', expected: false } $*/

const a = 'foo' /*# { pos: 16 } #*/

/*$ { fixture: 'should-not-trigger-on-import', expected: false } $*/

import React from 'react'; /*# { pos: 23 } #*/

/*$ { fixture: 'should-not-trigger-on-jsx-attributes', expected: false } $*/

import React from 'react';

const data = <div className="foo"></div>  /*# { pos: 31 } #*/

/*$ { fixture: 'should-not-trigger-on-ts-string-enums', expected: false } $*/

enum Foo {
    Bar = 'bar' /*# { pos: 14 } #*/
}

/*$ { fixture: 'should-not-trigger-on-object-property', expected: false } $*/

const foo = {
    'bar': 'baz' /*# { pos: 8 } #*/
}

/*$ { fixture: 'should-not-trigger-on-object-method', expected: false } $*/

const foo = {
    'bar'() {} /*# { pos: 8 } #*/
}
