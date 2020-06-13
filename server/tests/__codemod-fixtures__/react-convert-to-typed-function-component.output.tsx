/*$ { fixture: 'should-transform-fn-decl' } $*/

// @ts-nocheck

const HelloWorld: React.FunctionComponent<Props> = props => {
    return <div>Hello, world!</div>;
};

/*$ { fixture: 'should-transform-exported-fn' } $*/

export const HelloWorld: React.FunctionComponent<Props> = props => {
    return <div>Hello, world!</div>;
};

/*$ { fixture: 'should-transform-exported-default-fn' } $*/

// comment above
const HelloWorld: React.FunctionComponent<Props> = props => {
    return <div>Hello, world!</div>;
};

export default HelloWorld;
// comment below

/*$ { fixture: 'should-transform-without-typings' } $*/

const HelloWorld: React.FunctionComponent<any> = props => {
    return <div>Hello, world!</div>;
};

/*$ { fixture: 'should-transform-arrow-fn-expr' } $*/

const HelloWorld: React.FunctionComponent<Props> = (props) => {
    return <div>Hello, world!</div>;
}

/*$ { fixture: 'should-transform-exported-arrow-fn-expr' } $*/

export const HelloWorld: React.FunctionComponent<Props> = (props) => {
    return <div>Hello, world!</div>;
}

/*$ { fixture: 'should-transform-regular-fn-expr' } $*/

const HelloWorld: React.FunctionComponent<Props> = function(props) {
    return <div>Hello, world!</div>;
}
