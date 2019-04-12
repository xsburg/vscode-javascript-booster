/*$ { fixture: 'should-trigger-at-if', expected: true } $*/

const a = 1;

if (a) {  /*# { pos: 2 } #*/
    let b = 2;
} else {
}

/*$ { fixture: 'should-trigger-at-else', expected: true } $*/

const a = 1;

if (a) {
    let b = 2;
} else {  /*# { pos: 3 } #*/
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

const a = 1;

if (a) { /*# { pos: 1 } #*/
    let b = 2;
} else {
    let c = 3;
}

/*$ { fixture: 'should-not-trigger-no-else', expected: false } $*/

const a = 1;

if (a) { /*# { pos: 1 } #*/
    let b = 2;
}
