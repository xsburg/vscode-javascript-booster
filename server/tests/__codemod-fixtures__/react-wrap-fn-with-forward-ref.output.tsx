/*$ { fixture: 'should-transform-fn-decl' } $*/

// @ts-nocheck

const HelloWorld = React.forwardRef<any, Props>((props, ref) => {
    return <div>Hello, world!</div>;
});

/*$ { fixture: 'should-transform-fn-decl-without-types' } $*/

const HelloWorld = React.forwardRef((props, ref) => {
    return <div>Hello, world!</div>;
});

/*$ { fixture: 'should-transform-exported-fn' } $*/

export const HelloWorld = React.forwardRef<any, Props>((props, ref) => {
    return <div>Hello, world!</div>;
});

/*$ { fixture: 'should-transform-exported-default-fn' } $*/

const HelloWorld = React.forwardRef<any, Props>((props, ref) => {
    return <div>Hello, world!</div>;
});

export default HelloWorld;

/*$ { fixture: 'should-transform-arrow-fn-expr' } $*/

const HelloWorld = React.forwardRef<any, Props>((props, ref) => {
    return <div>Hello, world!</div>;
})

/*$ { fixture: 'should-transform-exported-arrow-fn-expr' } $*/

export const HelloWorld = React.forwardRef<any, Props>((props, ref) => {
    return <div>Hello, world!</div>;
})

/*$ { fixture: 'should-transform-arrow-fn-expr-with-spread' } $*/

const HelloWorld = React.forwardRef<any, Props>((
    {
        foo,
        bar
    },
    ref
) => {
    return <div>Hello, world!</div>;
})

/*$ { fixture: 'should-transform-with-types-in-declarator-only' } $*/

const HelloWorld = React.forwardRef<any, Props>((props) => {
    return <div>Hello, world!</div>;
})

/*$ { fixture: 'should-transform-with-default-params' } $*/

const HelloWorld = React.forwardRef<any, Props>((props = { foo: 'default-text' }) => {
    return <div>Hello, world!</div>;
})

/*$ { fixture: 'should-transform-regular-fn-expr-type' } $*/

const HelloWorld = React.forwardRef<any, Props>(function(props, ref) {
    return <div>Hello, world!</div>;
})
