/*$ { fixture: 'should-transform-fn-decl' } $*/

// @ts-nocheck

const foo = () => {
    doSomething();
};

/*$ { fixture: 'should-transform-fn-with-types-and-async' } $*/

const foo = async (arg1: Arg1): ReturnMe => {
    doSomething();
};

/*$ { fixture: 'should-transform-fn-with-default-export' } $*/

// comment above
const foo = () => {
    doSomething();
};

export default foo;
// comment below
