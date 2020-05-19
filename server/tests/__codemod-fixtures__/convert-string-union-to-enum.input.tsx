/*$ { fixture: 'should-transform-simple-case' } $*/

// @ts-nocheck

type Foo = 'Bar' | 'Baz'; /*# { pos: 8 } #*/

/*$ { fixture: 'should-generate-valid-enum-names' } $*/

type Foo = 'fooBar' | 'foo Baz' | 'foo-Boo' | 'foo_Moo'; /*# { pos: 8 } #*/

/*$ { fixture: 'should-transform-exported-type' } $*/

export type Foo = 'Bar' | 'Baz'; /*# { pos: 15 } #*/

/*$ { fixture: 'should-remove-duplicates' } $*/

type Foo = 'Bar' | 'Baz' | 'Baz'; /*# { pos: 8 } #*/
