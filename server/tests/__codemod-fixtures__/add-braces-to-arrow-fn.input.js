/*$ { fixture: 'should-transform-simple-expression' } $*/

function test() {
    const a = () => 42; /*# { pos: 19 } #*/
}

/*$ { fixture: 'should-transform-object-literal-expression' } $*/

function test() {
    const a = () => ({ /*# { pos: 19 } #*/
        foo: 'bar'
    });
}
