/*$ { fixture: 'should-trigger-at-var-decl', expected: true } $*/

// @ts-nocheck

type Foo = 'Bar' | 'Baz'; /*# { pos: 8 } #*/

/*$ { fixture: 'should-trigger-at-type-union', expected: true } $*/

type Foo = 'Bar' | 'Baz'; /*# { pos: 14 } #*/

/*$ { fixture: 'should-not-trigger-at-type-union-of-non-strings', expected: false } $*/

type Foo = 'Bar' | null; /*# { pos: 8 } #*/
