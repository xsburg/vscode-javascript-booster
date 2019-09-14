/*$ { fixture: 'should-trigger-at-simple-ternary', expected: true } $*/

function test1() {
    let foo = 'foo';
    foo ? this.setAction(foo) : this.setAction('bar'); /*# { pos: 9 } #*/
}

/*$ { fixture: 'should-trigger-at-var-init', expected: true } $*/

function test2() {
    let a = true ? 1 : 0; /*# { pos: 18 } #*/
}

/*$ { fixture: 'should-trigger-at-var-assign', expected: true } $*/

function test3() {
    let a;
    a = true ? 1 : 0; /*# { pos: 14 } #*/
}

/*$ { fixture: 'should-not-trigger-in-nested-expressions', expected: false } $*/

function test3() {
    let a = 'foo' + (true ? 'bar' : 'nobar'); /*# { pos: 27 } #*/
}
