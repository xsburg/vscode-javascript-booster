/*$ { fixture: 'should-transform-fn-decl' } $*/

// @ts-nocheck

function HelloWorld(props: Props) { /*# { pos: 4 } #*/
    return <div>Hello, world!</div>;
}

/*$ { fixture: 'should-transform-fn-decl-without-types' } $*/

function HelloWorld(props) { /*# { pos: 4 } #*/
    return <div>Hello, world!</div>;
}

/*$ { fixture: 'should-transform-arrow-fn-expr' } $*/

const HelloWorld: React.FunctionComponent<Props> = (props: Props) => { /*# { pos: 68 } #*/
    return <div>Hello, world!</div>;
}

/*$ { fixture: 'should-transform-regular-fn-expr-type' } $*/

const HelloWorld = function(props: Props) { /*# { pos: 25 } #*/
    return <div>Hello, world!</div>;
}
