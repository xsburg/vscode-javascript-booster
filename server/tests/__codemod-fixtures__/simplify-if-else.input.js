/*$ { fixture: 'should-transform-if-true' } $*/

function test() {
    if (true) { /*# { pos: 6 } #*/
        let a = 1;
        let b = 3;
    }
}

/*$ { fixture: 'should-transform-if-false' } $*/

function test() {
    let foo = 'bar';
    if (false) { /*# { pos: 6 } #*/
        let a = 1;
        let b = 3;
    }
}

/*$ { fixture: 'should-leave-if' } $*/

function test() {
    if (true) { /*# { pos: 6 } #*/
        let a = 1;
        let b = 3;
    } else {
        let a = 2;
        let b = 4;
    }
}

/*$ { fixture: 'should-leave-else' } $*/

function test() {
    if (false) { /*# { pos: 6 } #*/
        let a = 1;
        let b = 3;
    } else {
        let a = 2;
        let b = 4;
    }
}

/*$ { fixture: 'should-leave-condition' } $*/

function test() {
    let cond = 'foo';
    if (cond) { /*# { pos: 6 } #*/
        return true;
    } else {
        return false;
    }
}

/*$ { fixture: 'should-leave-condition-2' } $*/

function test() {
    let cond = 'foo';
    if (cond) { /*# { pos: 6 } #*/
        return true;
    }
    return false;
}

/*$ { fixture: 'should-leave-negated-condition' } $*/

function test() {
    let cond = 'foo';
    if (cond) { /*# { pos: 6 } #*/
        return false;
    } else {
        return true;
    }
}
