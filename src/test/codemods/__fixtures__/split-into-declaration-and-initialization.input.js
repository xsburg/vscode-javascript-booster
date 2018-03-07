/*$ { fixture: 'should-split-simple-case' } $*/

let a = 'foo'; /*# { pos: 3 } #*/

/*$ { fixture: 'should-split-when-no-initializer' } $*/

let a = 'foo', b; /*# { pos: 3 } #*/

/*$ { fixture: 'should-split-when-many-initializers' } $*/

let a = 'foo', b = 'bar'; /*# { pos: 3 } #*/
