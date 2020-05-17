/*$ { fixture: 'should-transform-simple-enum' } $*/

// @ts-nocheck

enum Foo {
    Bar = 'Bar',
    Baz = 'Baz',
}

/*$ { fixture: 'should-transform-enum-with-string-members' } $*/

enum Foo {
    Bar = 'Bar',
    Baz = 'Baz',
}

/*$ { fixture: 'should-infer-camel-case-if-there-are-multiple-matches' } $*/

enum Foo {
    FooBar = 'fooBar',
    Baz = 'baz',
}

/*$ { fixture: 'should-infer-camel-case-from-existing' } $*/

enum Foo {
    FooBar = 'fooBar',
    BazBoo = 'bazBoo',
}

/*$ { fixture: 'should-infer-kebab-case-from-existing' } $*/

enum Foo {
    FooBar = 'foo-bar',
    BazBoo = 'baz-boo',
}

/*$ { fixture: 'should-infer-snake-case-from-existing' } $*/

enum Foo {
    FooBar = 'foo_bar',
    BazBoo = 'baz_boo',
}
