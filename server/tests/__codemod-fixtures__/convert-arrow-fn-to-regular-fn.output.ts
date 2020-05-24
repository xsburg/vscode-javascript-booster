/*$ { fixture: 'should-transform-arrow-fn-over-var-decl' } $*/

// @ts-nocheck

function foo() {
    doSomething();
}

/*$ { fixture: 'should-transform-arrow-fn-over-arrow-fn' } $*/

function foo() {
    doSomething();
}

/*$ { fixture: 'should-transform-arrow-expr' } $*/

function foo() {
    return doSomething();
}

/*$ { fixture: 'should-keep-comments' } $*/

// An important note here, don't lose it
function foo() {
    return doSomething();
}

/*$ { fixture: 'should-keep-parameters' } $*/

function foo(a: number, b: string) {
    return doSomething();
}

/*$ { fixture: 'should-keep-types' } $*/

function foo(a: number, b: string): number {
    return doSomething();
}

/*$ { fixture: 'should-transfer-type-annotation-of-react-component' } $*/

function Foo(props: Props) {
    return doSomething();
}
