/* eslint-disable quotes */
var test;
test = 'hi' + true;
test = true + 'hi';

test = 'hi' + 1 + 2;
test = 'hi' + 1 + 2 + 3;
test = 1 + 2 + 'hi';
test = 1 + 2 + 'a' + b;

test = 'hi' + 1 - 2;
test = 'hi' + 1 - 2 - 3;
test = 1 - 2 + 'hi';

test = 'hi' + 1 * 2;
test = 1 * 2 + 'hi';

test = 'hi' + 1 / 2;
test = 1 / 2 + 'hi';

test = 'hi' + foo; // single
test = "hi" + foo; // double
test = `hi` + foo; // template literal
test = foo`hi` + bar; // tagged template literal

test = 'a\'b' + c; // escaped quote
test = 'a\"b' + c; // escaped quote
test = "a\'b" + c; // escaped quote
test = "a\"b" + c; // escaped quote
test = 'a\'b' + 'c'; // escaped quote
test = 'a\'b' + "c\"d"; // escaped quotes of different kinds
test = 'a\\"b' + c; // non-escaped quote

test = 'a\tb' + c; // tab
test = 'a\tb' + 'c'; // tab
test = 'a\u00A9' + b; // unicode escape

test = 'hi\nhello' + foo; // line break
test = 'hi' + // comment in the middle
  foo;
test = 'hi' // comment in the middle
  + foo;
test = 'hi' + // comment in the middle
  'foo' + // and in the middle again
  foo; // and at the end

test = `hi` + 'foo'; // template literal and string
test = 'hi' + `foo`; // string and template literal
test = 'hi' + 'foo'; // two strings
test = 'hi' + 'foo' + 'bar'; // three strings
test = `hi` + `foo`; // two template literals
test = `hi` + `foo` + `bar`; // three template literals

test = `${hi}` + 'foo'; // template literal with expression and string
test = 'foo' + `${hi}`; // string and template literal with expression
test = `hi ${foo} there` + `oh ${bar} hello`; // template literals with expressions
test = foo + `/${bar}`;

test = '(' + foo + ')';
test = '(' + foo + ')' + bar;
test = '(' + (foo + bar) + ')';
test = '(' + (1 + 1) + ')';
test = (a + 'b');

test = `hi${foo}` + bar;

test = '${hi}' + foo; // escaping a string
test = '${hi}${hello}' + foo; // escaping a string
test = '${hi}' + '${hello}'; // escaping a string

test = foo + 'hi';
test = foo + 'hi' + bar;
test = foo + 'hi' + bar + baz;

test = { a: 'hi' + foo }; // in an object
test = { ['a' + b]: 'c' + d }; // computed properties

test = ['hi' + foo]; // in an array
test = [
  foo + 'bar', // comment
  foo + 'bar', /* comment */
  foo + 'bar', /* comment */ // comment
];

test = +1 + 100;
test = +1 + '100';
test = +'1' + 100;
test = +'1' + +100;
test = +'1' + '100';
test = 1 + +100;
test = 1 + +'100';
test = '1' + -100; // this could probably be better
test = 1.2 + 'a' + b; // floats
test = 1.2 + 'a'; // floats

test = 1 + 1;
test = 1 - 1;
test = foo + 1;

test = 'hi' + foo + 1;
test = 'hi' + foo - 1;
test = 'hi' + (foo + 1);

test = 'hi' + foo.join(','); // function

test = 1 + a.toString() + 'b';
test = 1 + String(a) + 'b';
test = 1 + new String(a) + 'b';

test = 1 + a.b() + 'c';
test = 1 + Foo(a) + 'b';
test = 1 + new Foo(a) + 'b';

test = 'hi' + foo.bar; // object member
test = foo.bar + 'hi';
test = '(' + foo.bar + ')';
test = 'hi' + foo['bar'];

test = foo + bar + 'hi'; // foo and bar could be numeric
test = 'hi' + foo + bar;

test = 'foo' + (bar ? 'bar' : '');

foo('hi' + foo);
foo(foo + 'hi');
foo(a + '\\?.*' + b);

function a(b = 'c' + d) {
  return b + 'e';
}

(b = 'c' + d)  => {
  return b + 'e';
};

(b = 'c' + d)  => b + 'e';
(b = 'c' + d)  => (b + 'e');

test = a + 'b' + `c${'d' + e}`; // nested concatenation in template literals
