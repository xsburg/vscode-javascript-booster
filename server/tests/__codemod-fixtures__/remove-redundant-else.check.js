/*$ { fixture: 'should-trigger-at-if', expected: true } $*/

const a = 1;

if (a) {  /*# { pos: 2 } #*/
    let b = 2;
} else {
}

/*$ { fixture: 'should-trigger-at-else', expected: true } $*/

{
    const a = 1;

    if (a) {
        let b = 2;
    } else {  /*# { pos: 7 } #*/
    }
}

/*$ { fixture: 'should-trigger-when-if-returns', expected: true } $*/

function test() {
    if (true) {
        let b = 2;
        return;
    } else {  /*# { pos: 8 } #*/
        let b = 3;
    }
}

/*$ { fixture: 'should-not-trigger-else-not-empty', expected: false } $*/

{
    const a = 1;

    if (a) { /*# { pos: 5 } #*/
        let b = 2;
    } else {
        let c = 3;
    }
}

/*$ { fixture: 'should-not-trigger-no-else', expected: false } $*/

{
    const a = 1;

    if (a) { /*# { pos: 5 } #*/
        let b = 2;
    }
}

/*$ { fixture: 'should-not-trigger-no-else-return', expected: false } $*/

function test2() {
    const a = 1;

    if (a) { /*# { pos: 5 } #*/
        return 5;
    }
}
