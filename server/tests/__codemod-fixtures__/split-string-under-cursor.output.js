/*$ { fixture: 'should-split-into-two' } $*/

const a = 'foo' + 'bar';

/*$ { fixture: 'should-split-corner-case-start' } $*/

const a = '' + 'foo';

/*$ { fixture: 'should-split-corner-case-end' } $*/

const a = 'foo' + '';
