/*$ { fixture: 'should-trigger-at-declaration', expected: true } $*/

function test() {
    let a; /*# { pos: 9 } #*/
    a = 'foo';
}

/*$ { fixture: 'should-trigger-at-declarator', expected: true } $*/

function test() {
    let b, a; /*# { pos: 9 } #*/
    a = 'foo';
}

/*$ { fixture: 'should-not-trigger-if-not-applicable', expected: false } $*/

let a = 'foo'; /*# { pos: 12 } #*/

/*$ { fixture: 'should-not-trigger-if-different-scope', expected: false } $*/

function test() {
    let a; /*# { pos: 9 } #*/
    if (true) {
        a = 'foo';
    }
}
