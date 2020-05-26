/*$ { fixture: 'should-trigger-on-fn-name', expected: true } $*/

// @ts-nocheck

function foo() { /*# { pos: 11 } #*/
    doSomething();
};

/*$ { fixture: 'should-trigger-on-fn-decl', expected: true } $*/

// @ts-nocheck

function foo() { /*# { pos: 6 } #*/
    doSomething();
};
