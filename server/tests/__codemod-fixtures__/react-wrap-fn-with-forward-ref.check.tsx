/*$ { fixture: 'should-trigger-over-fn-decl', expected: true } $*/

// @ts-nocheck

function HelloWorld(props: Props) { /*# { pos: 4 } #*/
    return <div>Hello, world!</div>;
}

/*$ { fixture: 'should-trigger-over-fn-name', expected: true } $*/

function HelloWorld(props: Props) { /*# { pos: 16 } #*/
    return <div>Hello, world!</div>;
}

/*$ { fixture: 'should-trigger-over-exported-fn', expected: true } $*/

export function HelloWorld(props: Props) { /*# { pos: 22 } #*/
    return <div>Hello, world!</div>;
}

/*$ { fixture: 'should-trigger-over-exported-default-fn', expected: true } $*/

export default function HelloWorld(props: Props) { /*# { pos: 30 } #*/
    return <div>Hello, world!</div>;
}

/*$ { fixture: 'should-trigger-over-arrow-fn-expr', expected: true } $*/

const HelloWorld: React.FunctionComponent<Props> = (props: Props) => { /*# { pos: 68 } #*/
    return <div>Hello, world!</div>;
}

/*$ { fixture: 'should-trigger-over-exported-arrow-fn-expr', expected: true } $*/

export const HelloWorld: React.FunctionComponent<Props> = (props: Props) => { /*# { pos: 75 } #*/
    return <div>Hello, world!</div>;
}

/*$ { fixture: 'should-trigger-over-arrow-fn-expr-name', expected: true } $*/

const HelloWorld: React.FunctionComponent<Props> = (props: Props) => { /*# { pos: 14 } #*/
    return <div>Hello, world!</div>;
}

/*$ { fixture: 'should-trigger-over-arrow-fn-expr-type', expected: true } $*/

const HelloWorld: React.FunctionComponent<Props> = (props: Props) => { /*# { pos: 30 } #*/
    return <div>Hello, world!</div>;
}

/*$ { fixture: 'should-trigger-over-regular-fn-expr-type', expected: true } $*/

const HelloWorld = function(props: Props) { /*# { pos: 25 } #*/
    return <div>Hello, world!</div>;
}

/*$ { fixture: 'should-not-trigger-over-react-forward-ref', expected: false } $*/

const HelloWorld = React.forwardRef((props, ref) => { /*# { pos: 51 } #*/
    return <div>Hello, world!</div>;
});
