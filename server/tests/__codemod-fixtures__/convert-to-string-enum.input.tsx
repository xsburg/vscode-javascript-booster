/*$ { fixture: 'should-transform-simple-enum' } $*/

// @ts-nocheck

enum Foo { /*# { pos: 7 } #*/
    Bar,
    Baz,
}

/*$ { fixture: 'should-transform-enum-with-string-members' } $*/

enum Foo { /*# { pos: 7 } #*/
    Bar,
    Baz = 'Baz',
}

/*$ { fixture: 'should-infer-camel-case-if-there-are-multiple-matches' } $*/

enum Foo { /*# { pos: 7 } #*/
    FooBar,
    Baz = 'baz',
}

/*$ { fixture: 'should-infer-camel-case-from-existing' } $*/

enum Foo { /*# { pos: 7 } #*/
    FooBar,
    BazBoo = 'bazBoo',
}

/*$ { fixture: 'should-infer-kebab-case-from-existing' } $*/

enum Foo { /*# { pos: 7 } #*/
    FooBar,
    BazBoo = 'baz-boo',
}

/*$ { fixture: 'should-infer-snake-case-from-existing' } $*/

enum Foo { /*# { pos: 7 } #*/
    FooBar,
    BazBoo = 'baz_boo',
}
