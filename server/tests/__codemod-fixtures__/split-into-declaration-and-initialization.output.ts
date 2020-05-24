/*$ { fixture: 'should-split-simple-case' } $*/

// @ts-nocheck

let a;
a = 'foo';

/*$ { fixture: 'should-split-const' } $*/

let a;
a = 'foo';

/*$ { fixture: 'should-split-when-no-initializer' } $*/

let a, b;
a = 'foo';

/*$ { fixture: 'should-split-when-many-initializers' } $*/

let a, b;
a = 'foo';
b = 'bar';

/*$ { fixture: 'should-preserve-type' } $*/

let a: Foo, b: Bar;
a = 'foo';
b = 'bar';
