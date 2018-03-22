/*$ { fixture: 'should-not-trigger-on-expanded', expected: false } $*/

const el = <div></div>; /*# { pos: 15 } #*/

/*$ { fixture: 'should-not-trigger-on-attributes', expected: false } $*/

const el = <div className="foo-bar" />; /*# { pos: 25 } #*/

/*$ { fixture: 'should-trigger', expected: true } $*/

const el = <div className="foo-bar" />; /*# { pos: 15 } #*/

/*$ { fixture: 'should-trigger-inside-attribute', expected: true } $*/

const el = <Foo test={<div className="foo-bar" />}></Foo>; /*# { pos: 26 } #*/
