/*$ { fixture: 'should-trigger-on-var-declaration', expected: true } $*/

// @ts-nocheck

let foo = () => { /*# { pos: 7 } #*/
    doSomething();
};

/*$ { fixture: 'should-trigger-on-arrow-fn', expected: true } $*/

let foo = () => { /*# { pos: 15 } #*/
    doSomething();
};

/*$ { fixture: 'should-trigger-on-arrow-expr', expected: true } $*/

let foo = () => doSomething(); /*# { pos: 15 } #*/

/*$ { fixture: 'should-trigger-on-react-type-annotation', expected: true } $*/

let Foo: React.FunctionComponent<Props> = (props) => doSomething(); /*# { pos: 22 } #*/

/*$ { fixture: 'should-not-trigger-when-other-annotations-present', expected: false } $*/

let Foo: React.FooBar<Props> = (props) => doSomething(); /*# { pos: 41 } #*/

/*$ { fixture: 'should-not-trigger-if-this-used', expected: false } $*/

let foo = () => { /*# { pos: 15 } #*/
    if (doSomething()) {
        this.fireEvent();
    }
}
