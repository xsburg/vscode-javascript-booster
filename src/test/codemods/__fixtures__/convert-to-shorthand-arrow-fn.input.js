/*$ { fixture: 'should-transform-simple-expression' } $*/

function test() {
    const a = () => { /*# { pos: 19 } #*/
        return 42;
    };
}

/*$ { fixture: 'should-transform-object-literal-expression' } $*/

function test() {
    const a = () => { /*# { pos: 19 } #*/
        return {
            foo: 'bar'
        };
    };
}
