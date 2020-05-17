/*$ { fixture: 'should-transform-string-enum' } $*/

// @ts-nocheck

type Foo = 'FooBar' | 'FooBaz';

/*$ { fixture: 'should-transform-exported-string-enum' } $*/

export type Foo = 'FooBar' | 'FooBaz';
