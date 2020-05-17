/*$ { fixture: 'should-trigger-at-string-enum', expected: true } $*/

// @ts-nocheck

enum Foo { /*# { pos: 7 } #*/
    FooBar = 'FooBar',
    FooBaz = 'FooBaz',
}

/*$ { fixture: 'should-not-trigger-at-mixed-enums', expected: false } $*/

enum Foo { /*# { pos: 7 } #*/
    Bar,
    Baz = 'Baz',
}

/*$ { fixture: 'should-not-trigger-at-regular-enums', expected: false } $*/

enum Foo { /*# { pos: 7 } #*/
    Bar,
    Baz,
}
