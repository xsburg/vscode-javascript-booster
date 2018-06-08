/*$ { fixture: 'should-trigger-over-ternary-expr', expected: true } $*/

function test() {
    return true ? 1 : 0; /*# { pos: 17 } #*/
}

/*$ { fixture: 'should-trigger-over-anything-inside-ternary', expected: true } $*/

function test() {
    return true ? 1 : 0; /*# { pos: 14 } #*/
}

/*$ { fixture: 'should-not-trigger-on-normal-ternary', expected: false } $*/

function test() {
    let foo = 'bar';
    return foo ? 1 : 0; /*# { pos: 6 } #*/
}
