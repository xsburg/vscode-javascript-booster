/*$ { fixture: 'should-transform-simple-case' } $*/

// @ts-nocheck

enum Foo {
    Bar = 'Bar',
    Baz = 'Baz'
}

/*$ { fixture: 'should-generate-valid-enum-names' } $*/

enum Foo {
    FooBar = 'fooBar',
    FooBaz = 'foo Baz',
    FooBoo = 'foo-Boo',
    FooMoo = 'foo_Moo'
}

/*$ { fixture: 'should-transform-exported-type' } $*/

export enum Foo {
    Bar = 'Bar',
    Baz = 'Baz'
}

/*$ { fixture: 'should-remove-duplicates' } $*/

enum Foo {
    Bar = 'Bar',
    Baz = 'Baz'
}
