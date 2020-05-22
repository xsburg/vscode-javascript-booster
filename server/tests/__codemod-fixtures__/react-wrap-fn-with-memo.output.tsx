/*$ { fixture: 'should-transform-fn-decl' } $*/

// @ts-nocheck

const HelloWorld = React.memo<Props>(props => {
    return <div>Hello, world!</div>;
});

/*$ { fixture: 'should-transform-fn-decl-without-types' } $*/

const HelloWorld = React.memo(props => {
    return <div>Hello, world!</div>;
});

/*$ { fixture: 'should-transform-arrow-fn-expr' } $*/

const HelloWorld = React.memo<Props>((props) => {
    return <div>Hello, world!</div>;
})

/*$ { fixture: 'should-transform-arrow-fn-expr-with-spread' } $*/

const HelloWorld = React.memo<Props>(({
    foo,
    bar
}) => {
    return <div>Hello, world!</div>;
})

/*$ { fixture: 'should-transform-regular-fn-expr-type' } $*/

const HelloWorld = React.memo<Props>(function(props) {
    return <div>Hello, world!</div>;
})
