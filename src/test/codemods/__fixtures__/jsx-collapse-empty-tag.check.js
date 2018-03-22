/*$ { fixture: 'should-not-trigger-on-collapsed', expected: false } $*/

const el = <div />; /*# { pos: 15 } #*/

/*$ { fixture: 'should-not-trigger-on-attributes', expected: false } $*/

const el = <div className="foo-bar"></div>; /*# { pos: 25 } #*/

/*$ { fixture: 'should-not-trigger-on-non-empty', expected: false } $*/

const el = <div className="foo-bar">FOO</div>; /*# { pos: 15 } #*/

/*$ { fixture: 'should-trigger', expected: true } $*/

const el = <div className="foo-bar"></div>; /*# { pos: 15 } #*/

/*$ { fixture: 'should-trigger-inside-attribute', expected: true } $*/

const el = <Foo test={<div className="foo-bar"></div>}></Foo>; /*# { pos: 26 } #*/
