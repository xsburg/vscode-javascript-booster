/*$ { fixture: 'should-transform-if-true' } $*/

function test() {
    let a = 1;
    let b = 3;
}

/*$ { fixture: 'should-transform-if-false' } $*/

function test() {
    let foo = 'bar';
}

/*$ { fixture: 'should-leave-if' } $*/

function test() {
    let a = 1;
    let b = 3;
}

/*$ { fixture: 'should-leave-else' } $*/

function test() {
    let a = 2;
    let b = 4;
}

/*$ { fixture: 'should-leave-condition' } $*/

function test() {
    let cond = 'foo';
    return !!cond;
}

/*$ { fixture: 'should-leave-condition-2' } $*/

function test() {
    let cond = 'foo';
    return !!cond;
}

/*$ { fixture: 'should-leave-negated-condition' } $*/

function test() {
    let cond = 'foo';
    return !cond;
}
