/*$ { fixture: 'should-not-trigger', expected: false } $*/

let a = 1; /*# { pos: 9 } #*/

/*$ { fixture: 'should-not-trigger-at-var-decl', expected: false } $*/

const a = () => { /*# { pos: 15 } #*/
    let b = 3;
};

/*$ { fixture: 'should-trigger', expected: true } $*/

let b = () => { /*# { pos: 13 } #*/
    return 2;
};

/*$ { fixture: 'should-trigger-at-expression-statement', expected: true } $*/

let b = () => { /*# { pos: 13 } #*/
    dispatch({
        type: 'FOO'
    });
};

/*$ { fixture: 'should-trigger-at-assignment-statement', expected: true } $*/

let b;
const a = () => { /*# { pos: 15 } #*/
    b = 3;
};
