/*$ { fixture: 'should-trigger-on-if-true', expected: true } $*/

function test() {
    if (true) { /*# { pos: 6 } #*/
        let a = 1;
    }
}

/*$ { fixture: 'should-trigger-on-if-false', expected: true } $*/

function test() {
    if (false) { /*# { pos: 6 } #*/
        let a = 1;
    }
}

/*$ { fixture: 'should-trigger-on-if-true-else-true', expected: true } $*/

function test() {
    let cond = 'foo';
    if (cond) { /*# { pos: 6 } #*/
        return true;
    } else {
        return false;
    }
}

/*$ { fixture: 'should-not-trigger-on-normal-if', expected: false } $*/

function test() {
    let c = 1;
    if (c) { /*# { pos: 6 } #*/
        let a = 1;
    }
}
