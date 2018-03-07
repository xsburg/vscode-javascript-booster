/*$ { fixture: 'should-flip-statements' } $*/

const a = 1;

if (a) { /*# { pos: 2 } #*/
    let b = 2;
} else {
    let c = 3;
}

/*$ { fixture: 'should-handle-no-else' } $*/

const a = 1;

if (a) { /*# { pos: 2 } #*/
    let b = 2;
}

/*$ { fixture: 'should-remove-unary-not' } $*/

const a = 1;

if (!a) { /*# { pos: 2 } #*/
    let b = 2;
} else {
    let c = 3;
}

/*$ { fixture: 'should-convert-binary-operator' } $*/

const a = 1;

if (a < 2) { /*# { pos: 2 } #*/
    let b = 2;
} else {
    let c = 3;
}

/*$ { fixture: 'should-default-to-adding-negation' } $*/

const a = 1;

if (a) { /*# { pos: 2 } #*/
    let b = 2;
} else {
    let c = 3;
}

/*$ { fixture: 'should-negate-complex-expr' } $*/

let a = 1;
let b = 2;

if (a + b) { /*# { pos: 2 } #*/
    a = 0;
} else {
    b = 0;
}
