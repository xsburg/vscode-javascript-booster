// Test comment
import { pluck } from 'lodash';
[1, 2].forEach(num => num);
const test = [{a: 1}, {a: 2}, {a: 3}];
const result = pluck(test, 'a');
