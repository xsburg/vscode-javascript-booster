/*$ { fixture: 'should-trigger-at-if', expected: true } $*/

function test() {
    let a;
    if (true) {
        a = 1; /*# { pos: 6 } #*/
    } else {
        a = 0;
    }
}

/*$ { fixture: 'should-trigger-all-inside-if', expected: true } $*/

function test() {
    let a;
    if (true) {
        a = 1; /*# { pos: 11 } #*/
    } else {
        a = 0;
    }
}

/*$ { fixture: 'should-not-trigger-if-if-has-other-statements', expected: false } $*/

function test() {
    let a;
    if (true) {
        a = 1; /*# { pos: 11 } #*/
        let b = 2;
    } else {
        a = 0;
    }
}
