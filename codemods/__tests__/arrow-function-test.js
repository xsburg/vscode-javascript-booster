'use strict';

const defineTest = require('jscodeshift/dist/testUtils').defineTest;

const printOptions = {
  trailingComma: true,
};
defineTest(__dirname, 'arrow-function', {
  'inline-single-expressions': true,
  printOptions,
});
defineTest(__dirname, 'arrow-function', {}, 'arrow-function2');

defineTest(__dirname, 'arrow-function', {
  'max-width': 40,
}, 'arrow-function-length-40');
