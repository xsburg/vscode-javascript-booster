/*$ { fixture: 'should-transform-fn-decl' } $*/

// @ts-nocheck

function HelloWorld(props: Props) { /*# { pos: 4 } #*/
    return <div>Hello, world!</div>;
}

/*$ { fixture: 'should-transform-fn-decl-without-types' } $*/

function HelloWorld(props) { /*# { pos: 4 } #*/
    return <div>Hello, world!</div>;
}

/*$ { fixture: 'should-transform-exported-fn' } $*/

export function HelloWorld(props: Props) { /*# { pos: 22 } #*/
    return <div>Hello, world!</div>;
}

/*$ { fixture: 'should-transform-exported-default-fn' } $*/

export default function HelloWorld(props: Props) { /*# { pos: 30 } #*/
    return <div>Hello, world!</div>;
}

/*$ { fixture: 'should-transform-arrow-fn-expr' } $*/

const HelloWorld: React.FunctionComponent<Props> = (props: Props) => { /*# { pos: 68 } #*/
    return <div>Hello, world!</div>;
}

/*$ { fixture: 'should-transform-exported-arrow-fn-expr' } $*/

export const HelloWorld: React.FunctionComponent<Props> = (props: Props) => { /*# { pos: 75 } #*/
    return <div>Hello, world!</div>;
}

/*$ { fixture: 'should-transform-arrow-fn-expr-with-spread' } $*/

const HelloWorld: React.FunctionComponent<Props> = ({ foo, bar }: Props) => { /*# { pos: 75 } #*/
    return <div>Hello, world!</div>;
}

/*$ { fixture: 'should-transform-with-types-in-declarator-only' } $*/

const HelloWorld: React.FunctionComponent<Props> = (props) => { /*# { pos: 61 } #*/
    return <div>Hello, world!</div>;
}

/*$ { fixture: 'should-transform-with-default-params' } $*/

const HelloWorld: React.FunctionComponent<Props> = (props = { foo: 'default-text' }) => { /*# { pos: 87 } #*/
    return <div>Hello, world!</div>;
}

/*$ { fixture: 'should-transform-regular-fn-expr-type' } $*/

const HelloWorld = function(props: Props) { /*# { pos: 25 } #*/
    return <div>Hello, world!</div>;
}
