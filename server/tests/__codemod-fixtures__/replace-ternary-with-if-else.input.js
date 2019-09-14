/*$ { fixture: 'should-transform-at-simple-ternary' } $*/

function test1() {
    let foo = 'foo';
    foo ? this.setAction(foo) : this.setAction('bar'); /*# { pos: 9 } #*/
}

/*$ { fixture: 'should-transform-at-var-init' } $*/

function test2() {
    let a = true ? 1 : 0; /*# { pos: 18 } #*/
}

/*$ { fixture: 'should-transform-at-var-assign' } $*/

function test3() {
    let a;
    a = true ? 1 : 0; /*# { pos: 14 } #*/
}

/*$ { fixture: 'should-transform-const-into-let' } $*/

function test4() {
    const a = true ? 1 : 0; /*# { pos: 20 } #*/
}

/*$ { fixture: 'should-transform-multiple-declarations' } $*/

function test5() {
    const a = 0, b = (true ? a : 0), c = b + 1; /*# { pos: 28 } #*/
}
