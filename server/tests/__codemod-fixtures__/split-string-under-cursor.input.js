/*$ { fixture: 'should-split-into-two' } $*/

const a = 'foobar'; /*# { pos: 15 } #*/

/*$ { fixture: 'should-split-corner-case-start' } $*/

const a = 'foo'; /*# { pos: 12 } #*/

/*$ { fixture: 'should-split-corner-case-end' } $*/

const a = 'foo'; /*# { pos: 15 } #*/
