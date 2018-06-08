/*$ { fixture: 'should-transform-if-true' } $*/

function test() {
    let a = 1;
}

/*$ { fixture: 'should-transform-if-false' } $*/

function test() {
    let foo = 'bar';
}

/*$ { fixture: 'should-leave-if' } $*/

function test() {
    let a = 1;
}

/*$ { fixture: 'should-leave-else' } $*/

function test() {
    let a = 2;
}

/*$ { fixture: 'should-leave-condition' } $*/

function test() {
    let cond = 'foo';
    return !!cond;
}

/*$ { fixture: 'should-leave-negated-condition' } $*/

function test() {
    let cond = 'foo';
    return !cond;
}
