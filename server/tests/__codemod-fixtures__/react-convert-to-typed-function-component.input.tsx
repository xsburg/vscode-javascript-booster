/*$ { fixture: 'should-transform-fn-decl' } $*/

// @ts-nocheck

function HelloWorld(props: Props) { /*# { pos: 16 } #*/
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

const HelloWorld = (props: Props) => { /*# { pos: 36 } #*/
    return <div>Hello, world!</div>;
}

/*$ { fixture: 'should-transform-exported-arrow-fn-expr' } $*/

export const HelloWorld: React.FunctionComponent<Props> = (props: Props) => { /*# { pos: 75 } #*/
    return <div>Hello, world!</div>;
}

/*$ { fixture: 'should-transform-regular-fn-expr' } $*/

const HelloWorld = function(props: Props) { /*# { pos: 25 } #*/
    return <div>Hello, world!</div>;
}
