/*$ { fixture: 'should-split-simple-case' } $*/

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
