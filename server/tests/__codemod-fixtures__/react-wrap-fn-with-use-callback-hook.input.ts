/*$ { fixture: 'should-transform-function-decl' } $*/

// @ts-nocheck

function useHook() {
    let a, b;
    function onClick(a: string, b: number): void { /*# { pos: 18 } #*/
        dispatch(loadData());
    };
}

/*$ { fixture: 'should-transform-fn-expression' } $*/

function useHook() {
    let a, b;
    const onClick = function onClick(a: string, b: number): void { /*# { pos: 24 } #*/
        dispatch(loadData());
    };
}

/*$ { fixture: 'should-transform-arrow-expression' } $*/

function useHook() {
    let a, b;
    const onClick = (a: string, b: number): void => { /*# { pos: 51 } #*/
        dispatch(loadData());
    };
}

/*$ { fixture: 'should-transform-assignment-expression' } $*/

function useHook() {
    let a, b, onClick;
    onClick = (a: string, b: number): void => { /*# { pos: 11 } #*/
        dispatch(loadData());
    };
}
