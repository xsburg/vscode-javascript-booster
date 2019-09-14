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

/*$ { fixture: 'should-transform-const-into-let' } $*/

function test4() {
    let a;

    if (true) {
        a = 1;
    } else {
        a = 0;
    }
}

/*$ { fixture: 'should-transform-multiple-declarations' } $*/

function test5() {
    let a = 0, b;

    if (true) {
        b = a;
    } else {
        b = 0;
    }

    const c = b + 1;
}
