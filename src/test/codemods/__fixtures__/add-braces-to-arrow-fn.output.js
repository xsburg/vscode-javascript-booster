/*$ { fixture: 'should-transform-simple-expression' } $*/

function test() {
    const a = () => {
        return 42;
    };
}

/*$ { fixture: 'should-transform-object-literal-expression' } $*/

function test() {
    const a = () => {
        return {
            foo: 'bar'
        };
    };
}
