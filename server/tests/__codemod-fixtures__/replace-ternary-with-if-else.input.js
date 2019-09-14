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
