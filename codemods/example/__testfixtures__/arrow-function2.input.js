/* eslint-disable no-extra-bind */
'use strict';

var fn1 = (function() {
  console.log('Banana!');
}).bind(this);

var fn2 = (function() {
  console.log('foo!');
}).bind(this);
