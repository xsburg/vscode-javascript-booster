/*$ { fixture: 'should-transform-at-simple-ternary' } $*/

function test1() {
    let foo = 'foo';
    if (foo) {
        this.setAction(foo);
    } else {
        this.setAction('bar');
    }
}

/*$ { fixture: 'should-transform-at-var-init' } $*/

function test2() {
    let a;
    if (true) {
        a = 1;
    } else {
        a = 0;
    }
}

/*$ { fixture: 'should-transform-at-var-assign' } $*/

function test3() {
    let a;
    if (true) {
        a = 1;
    } else {
        a = 0;
    }
}
