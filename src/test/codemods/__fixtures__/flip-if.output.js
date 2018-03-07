/*$ { fixture: 'should-flip-statements' } $*/

const a = 1;

if (!a) {
    let c = 3;
} else {
    let b = 2;
}

/*$ { fixture: 'should-handle-no-else' } $*/

const a = 1;

if (!a) {
    debugger;
} else {
    let b = 2;
}

/*$ { fixture: 'should-remove-unary-not' } $*/

const a = 1;

if (a) {
    let c = 3;
} else {
    let b = 2;
}

/*$ { fixture: 'should-convert-binary-operator' } $*/

const a = 1;

if (a >= 2) {
    let c = 3;
} else {
    let b = 2;
}

/*$ { fixture: 'should-default-to-adding-negation' } $*/

const a = 1;

if (!a) {
    let c = 3;
} else {
    let b = 2;
}

/*$ { fixture: 'should-negate-complex-expr' } $*/

let a = 1;
let b = 2;

if (!(a + b)) {
    b = 0;
} else {
    a = 0;
}
