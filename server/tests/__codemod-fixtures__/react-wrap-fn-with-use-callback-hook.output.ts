/*$ { fixture: 'should-transform-function-decl' } $*/

// @ts-nocheck

function useHook() {
    let a, b;

    const onClick = useCallback((a: string, b: number): void => {
        dispatch(loadData());
    }, []);
}

/*$ { fixture: 'should-transform-fn-expression' } $*/

function useHook() {
    let a, b;
    const onClick = useCallback(function onClick(a: string, b: number): void {
        dispatch(loadData());
    }, []);
}

/*$ { fixture: 'should-transform-arrow-expression' } $*/

function useHook() {
    let a, b;
    const onClick = useCallback((a: string, b: number): void => {
        dispatch(loadData());
    }, []);
}

/*$ { fixture: 'should-transform-assignment-expression' } $*/

function useHook() {
    let a, b, onClick;
    onClick = useCallback((a: string, b: number): void => {
        dispatch(loadData());
    }, []);
}

/*$ { fixture: 'should-transform-async-fn' } $*/

function useHook() {
    let a, b;

    const onClick = useCallback(async (a: string, b: number) => {
        dispatch(loadData());
    }, []);
}
