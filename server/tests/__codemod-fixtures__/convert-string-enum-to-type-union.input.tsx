/*$ { fixture: 'should-transform-string-enum' } $*/

// @ts-nocheck

enum Foo { /*# { pos: 7 } #*/
    FooBar = 'FooBar',
    FooBaz = 'FooBaz',
}

/*$ { fixture: 'should-transform-exported-string-enum' } $*/

export enum Foo { /*# { pos: 14 } #*/
    FooBar = 'FooBar',
    FooBaz = 'FooBaz',
}
