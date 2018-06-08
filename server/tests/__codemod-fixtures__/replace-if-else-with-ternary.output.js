/*$ { fixture: 'should-transform-assignment' } $*/

function test() {
    let a;
    let b = true;
    a = (b ? 1 : 0);
}

/*$ { fixture: 'should-transform-return' } $*/

function test() {
    return (true ? 1 : 0);
}

/*$ { fixture: 'should-transform-return-without-else' } $*/

function test() {
    return (true ? 1 : 0);
}
