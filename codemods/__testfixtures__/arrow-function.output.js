/* eslint-disable no-extra-bind */
'use strict';

var fn1 = () => console.log('Banana!');

var fn2 = (function() {
  console.log('Banana banana!');
}).bind(this, 1, 2, 3);

var fn3 = (a, b, c) => {
  console.log('foo!');
  console.log(a, b, c);
};

var fn4 = () => console.log('foo!');

var fn5 = (function named() {
  console.log("don't transform me!");
}).bind(this);

var fn6 = () => ({
  a: 1,
});

var fn7 = /*2*//*1*/() => /*3*//*4*//*5*/ {/*6*/
  console.log('Keep');
  console.log('comments');
}/*7*//*8*//*10*//*9*//*11*//*12*//*13*/;

[1, 2, 3].map(x => x * x);

[1, 2, 3].map(x => x * x);

compare(1, 2, (num1, num2) => num1 > num2);

/*1*/compare/*2*/(/*3*/1, /*4*/2, /*5*/(/*6*//*7*/num1/*8*/, /*9*/num2/*10*/) => /*13*//*11*//*12*/num1 > num2/*14*//*15*//*16*/)/*17*/;/*18*/

Promise.resolve()
.then(function() {
  console.log('foo');
}.bind(this, 'a'))
.then(a => 4);

foo(() => /*1*//*2*/console.log('Keep comments when inlining single expressions')
/*3*//*4*/);

foo(function(a) {
  this.bar(function() {
    return a + this.b;
  });
});

foo(function(a) {
  bar(function() {
    return a + this.b;
  });
});

foo(function(a) {
  bar(() => a + this.b);
});

foo(function bar() {
  console.log('foo');
});

foo(function baz_prototype() {
  console.log('foo');
});

baz_prototype.prototype = {};
