'use strict';

const defineTest = require('jscodeshift/dist/testUtils').defineTest;

const printOptions = {
  trailingComma: true,
};
defineTest(__dirname, 'rm-merge', {printOptions});
