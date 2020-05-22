/*$ { fixture: 'should-transform-fn-decl' } $*/

// @ts-nocheck

const HelloWorld = React.forwardRef<any, Props>((props, ref) => {
    return <div>Hello, world!</div>;
});

/*$ { fixture: 'should-transform-fn-decl-without-types' } $*/

const HelloWorld = React.forwardRef((props, ref) => {
    return <div>Hello, world!</div>;
});

/*$ { fixture: 'should-transform-arrow-fn-expr' } $*/

const HelloWorld = React.forwardRef<any, Props>((props, ref) => {
    return <div>Hello, world!</div>;
});

/*$ { fixture: 'should-transform-arrow-fn-expr-with-spread' } $*/

const HelloWorld = React.forwardRef<any, Props>(({ foo, bar }, ref) => {
    return <div>Hello, world!</div>;
});

/*$ { fixture: 'should-transform-regular-fn-expr-type' } $*/

const HelloWorld = React.forwardRef<any, Props>((props, ref) => {
    return <div>Hello, world!</div>;
});
