/*$ { fixture: 'should-transform-assignment' } $*/

function test() {
    let a;
    let b = true;
    if (b) {
        a = 1; /*# { pos: 10 } #*/
    } else {
        a = 0;
    }
}

/*$ { fixture: 'should-transform-return' } $*/

function test() {
    if (true) { /*# { pos: 6 } #*/
        return 1;
    } else {
        return 0;
    }
}

/*$ { fixture: 'should-transform-return-without-else' } $*/

function test() {
    if (true) { /*# { pos: 6 } #*/
        return 1;
    }
    return 0;
}
