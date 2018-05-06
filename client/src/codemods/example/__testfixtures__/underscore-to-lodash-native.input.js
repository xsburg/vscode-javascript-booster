// Test comment
const _ = require('underscore');
_.forEach([1, 2], num => num);
const test = [{a: 1}, {a: 2}, {a: 3}];
const result = _.pluck(test, 'a');
