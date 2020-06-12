/*$ { fixture: 'should-transform-fn-decl' } $*/

// @ts-nocheck

function foo() { /*# { pos: 11 } #*/
    doSomething();
};

/*$ { fixture: 'should-transform-fn-with-types-and-async' } $*/

async function foo(arg1: Arg1): ReturnMe { /*# { pos: 11 } #*/
    doSomething();
};

/*$ { fixture: 'should-transform-fn-with-default-export' } $*/

// comment above
export default function foo() { /*# { pos: 21 } #*/
    doSomething();
}
// comment below
