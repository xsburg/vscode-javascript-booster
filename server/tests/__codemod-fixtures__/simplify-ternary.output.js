/*$ { fixture: 'should-return-if-branch' } $*/

function test() {
    return 1;
}

/*$ { fixture: 'should-return-else-branch' } $*/

function test() {
    return 1;
}

/*$ { fixture: 'should-return-condition' } $*/

function test() {
    let a = 'foo';
    return !!a;
}

/*$ { fixture: 'should-return-negated-condition' } $*/

function test() {
    let a = 'foo';
    return !a;
}

/*$ { fixture: 'should-transform-into-or' } $*/

function test() {
    let a = 'foo';
    let b = 'bar';
    return a || b; /*# { pos: 14 } #*/
}
