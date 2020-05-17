/*$ { fixture: 'should-trigger-at-regular-enum', expected: true } $*/

// @ts-nocheck

enum Foo { /*# { pos: 7 } #*/
    Bar,
    Baz,
}

/*$ { fixture: 'should-trigger-at-partially-string-enum', expected: true } $*/

enum Foo { /*# { pos: 7 } #*/
    Bar,
    Baz = 'Baz',
}

/*$ { fixture: 'should-not-trigger-at-enums-with-nonstring-expr', expected: false } $*/

enum Foo { /*# { pos: 7 } #*/
    Bar,
    Baz = 2,
}

/*$ { fixture: 'should-not-trigger-at-enum-members', expected: false } $*/

enum Foo {
    Bar, /*# { pos: 7 } #*/
    Baz,
}
