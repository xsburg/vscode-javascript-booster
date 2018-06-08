/*$ { fixture: 'should-return-if-branch' } $*/

function test() {
    return true ? 1 : 0; /*# { pos: 14 } #*/
}

/*$ { fixture: 'should-return-else-branch' } $*/

function test() {
    return false ? 1 : 0; /*# { pos: 14 } #*/
}

/*$ { fixture: 'should-return-condition' } $*/

function test() {
    let a = 'foo';
    return a ? true : false; /*# { pos: 14 } #*/
}

/*$ { fixture: 'should-return-negated-condition' } $*/

function test() {
    let a = 'foo';
    return a ? false : true; /*# { pos: 14 } #*/
}

/*$ { fixture: 'should-transform-into-or' } $*/

function test() {
    let a = 'foo';
    let b = 'bar';
    return a ? a : b; /*# { pos: 14 } #*/
}
