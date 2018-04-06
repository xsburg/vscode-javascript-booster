/*$ { fixture: 'should-convert-with-initializers' } $*/

const a = 'foo', b = 'bar'; /*# { pos: 3 } #*/

/*$ { fixture: 'should-convert-without-initializers' } $*/

let a = 'foo', b; /*# { pos: 3 } #*/
