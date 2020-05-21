/*$ { fixture: 'should-trigger-inside-function-decl', expected: true } $*/

// @ts-nocheck

function useHook() {
    let a, b;
    function onClick() { /*# { pos: 18 } #*/
        dispatch(loadData());
    };
}

/*$ { fixture: 'should-trigger-inside-function-expr', expected: true } $*/

const whatever = function useHook() {
    let a, b;
    function onClick() { /*# { pos: 18 } #*/
        dispatch(loadData());
    };
}

/*$ { fixture: 'should-trigger-inside-var-decl', expected: true } $*/

const useHook = () => {
    let a, b;
    function onClick() { /*# { pos: 18 } #*/
        dispatch(loadData());
    };
}

/*$ { fixture: 'should-trigger-inside-assignment-expr', expected: true } $*/

let useHook;
useHook = () => {
    let a, b;
    function onClick() { /*# { pos: 18 } #*/
        dispatch(loadData());
    };
}

/*$ { fixture: 'should-trigger-inside-property-member', expected: true } $*/

let someObj = {
    useHook: () => {
        let a, b;
        function onClick() { /*# { pos: 21 } #*/
            dispatch(loadData());
        };
    }
};

/*$ { fixture: 'should-trigger-inside-property-fn', expected: true } $*/

let someObj = {
    useHook() {
        let a, b;
        function onClick() { /*# { pos: 21 } #*/
            dispatch(loadData());
        };
    }
};

/*$ { fixture: 'should-trigger-inside-assignment-pattern', expected: true } $*/

const {
    useHook = () => {
        let a, b;
        function onClick() { /*# { pos: 21 } #*/
            dispatch(loadData());
        };
    }
} = {};

/*$ { fixture: 'should-trigger-over-fn-decl', expected: true } $*/

function useHook() {
    let a, b;
    function onClick() { /*# { pos: 10 } #*/
        dispatch(loadData());
    };
}

/*$ { fixture: 'should-trigger-over-fn-name', expected: true } $*/

function useHook() {
    let a, b;
    function onClick() { /*# { pos: 18 } #*/
        dispatch(loadData());
    };
}

/*$ { fixture: 'should-trigger-over-fn-expression', expected: true } $*/

function useHook() {
    let a, b;
    const onClick = function onClick() { /*# { pos: 24 } #*/
        dispatch(loadData());
    };
}

/*$ { fixture: 'should-trigger-over-arrow-expression', expected: true } $*/

function useHook() {
    let a, b;
    const onClick = () => { /*# { pos: 25 } #*/
        dispatch(loadData());
    };
}

/*$ { fixture: 'should-not-trigger-inside-while', expected: false } $*/

function useHook() {
    let a, b;
    while (true) {
        function onClick() { /*# { pos: 22 } #*/
            dispatch(loadData());
        };
    }
}

/*$ { fixture: 'should-not-trigger-inside-for', expected: false } $*/

function useHook() {
    let a, b;
    for (let i = 0; i < 10; i++) {
        function onClick() { /*# { pos: 22 } #*/
            dispatch(loadData());
        };
    }
}

/*$ { fixture: 'should-not-trigger-inside-for-of', expected: false } $*/

function useHook() {
    let a, b;
    for (let n of nums) {
        function onClick() { /*# { pos: 22 } #*/
            dispatch(loadData());
        };
    }
}

/*$ { fixture: 'should-not-trigger-inside-for-of', expected: false } $*/

function useHook() {
    let a, b;
    for (let n in nums) {
        function onClick() { /*# { pos: 22 } #*/
            dispatch(loadData());
        };
    }
}

/*$ { fixture: 'should-not-trigger-inside-do-while', expected: false } $*/

function useHook() {
    let a, b;
    do {
        function onClick() { /*# { pos: 22 } #*/
            dispatch(loadData());
        };
    } while (true);
}

/*$ { fixture: 'should-not-trigger-inside-if-condition', expected: false } $*/

function useHook() {
    let a, b;
    if (cond) {
        function onClick() { /*# { pos: 22 } #*/
            dispatch(loadData());
        };
    }
}

/*$ { fixture: 'should-not-trigger-inside-switch-condition', expected: false } $*/

function useHook() {
    let a, b;
    switch (cond) {
        case 1:
            function onClick() { /*# { pos: 22 } #*/
                dispatch(loadData());
            };
            break;
    }
}

/*$ { fixture: 'should-not-trigger-outside-target-scenario', expected: false } $*/

function useHook() {
    let a, b; /*# { pos: 12 } #*/
    do {
        function onClick() {
            dispatch(loadData());
        };
    } while (true);
}
