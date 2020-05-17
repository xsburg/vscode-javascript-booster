/*$ { fixture: 'should-transform-arrow-fn-over-var-decl' } $*/

// @ts-nocheck

let foo = () => { /*# { pos: 7 } #*/
    doSomething();
};

/*$ { fixture: 'should-transform-arrow-fn-over-arrow-fn' } $*/

let foo = () => { /*# { pos: 15 } #*/
    doSomething();
};

/*$ { fixture: 'should-transform-arrow-expr' } $*/

let foo = () => doSomething(); /*# { pos: 15 } #*/

/*$ { fixture: 'should-keep-comments' } $*/

// An important note here, don't lose it
let foo = () => doSomething(); /*# { pos: 15 } #*/

/*$ { fixture: 'should-keep-parameters' } $*/

let foo = (a: number, b: string) => doSomething(); /*# { pos: 35 } #*/

/*$ { fixture: 'should-keep-types' } $*/

let foo = (a: number, b: string): number => doSomething(); /*# { pos: 43 } #*/
