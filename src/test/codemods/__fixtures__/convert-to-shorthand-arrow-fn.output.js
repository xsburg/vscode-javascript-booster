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
