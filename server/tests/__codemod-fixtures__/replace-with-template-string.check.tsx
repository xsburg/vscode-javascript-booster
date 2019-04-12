/*$ { fixture: 'should-trigger-at-literal', expected: true } $*/

{
    const a = 'foo'; /*# { pos: 18 } #*/
}

/*$ { fixture: 'should-trigger-at-binary-expr', expected: true } $*/

{
    const a = 'foo';
    const b = a + 'bar'; /*# { pos: 16 } #*/
}

/*$ { fixture: 'should-trigger-at-ternary-expr', expected: true } $*/

{
    const a = 'foo';
    const b = 'bar';
    const c = a + b + 'baz'; /*# { pos: 16 } #*/
}

/*$ { fixture: 'should-not-trigger-when-no-literal', expected: false } $*/

{
    const a = 'foo';
    const b = 'bar';
    const c = a + b; /*# { pos: 16 } #*/
}

/*$ { fixture: 'should-not-trigger-on-import', expected: false } $*/

import Meact from 'react'; /*# { pos: 23 } #*/

/*$ { fixture: 'should-not-trigger-on-jsx-attributes', expected: false } $*/

import React from 'react';

const data = <div className="foo"></div>  /*# { pos: 31 } #*/

/*$ { fixture: 'should-not-trigger-on-ts-string-enums', expected: false } $*/

enum Foo {
    Bar = 'bar' /*# { pos: 14 } #*/
}

/*$ { fixture: 'should-not-trigger-on-object-property', expected: false } $*/

{
    const foo = {
        'bar': 'baz' /*# { pos: 12 } #*/
    }
}

/*$ { fixture: 'should-not-trigger-on-object-method', expected: false } $*/

{
    const foo = {
        'bar'() {} /*# { pos: 12 } #*/
    }
}
