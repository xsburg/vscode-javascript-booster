/*$ { fixture: 'should-transform-simple-expression' } $*/

function test() {
    const a = () => 42;
}

/*$ { fixture: 'should-transform-object-literal-expression' } $*/

function test() {
    const a = () => ({
        foo: 'bar'
    });
}

/*$ { fixture: 'should-transform-empty-return' } $*/

function test() {
    const a = () => undefined;
}

/*$ { fixture: 'should-transform-expression-statement' } $*/

function test() {
    const a = () => dispatch({
        type: 'FOO'
    });
}

/*$ { fixture: 'should-transform-assignment-statement' } $*/

function test() {
    let b;
    const a = () => b = 3;
}

/*$ { fixture: 'should-transform-arrow' } $*/

function test() {
    const a = async () => 1;
}
