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

/*$ { fixture: 'should-transform-empty-return' } $*/

function test() {
    const a = () => { /*# { pos: 19 } #*/
        return;
    };
}

/*$ { fixture: 'should-transform-expression-statement' } $*/

function test() {
    const a = () => { /*# { pos: 19 } #*/
        dispatch({
            type: 'FOO'
        });
    };
}

/*$ { fixture: 'should-transform-assignment-statement' } $*/

function test() {
    let b;
    const a = () => { /*# { pos: 19 } #*/
        b = 3;
    };
}
