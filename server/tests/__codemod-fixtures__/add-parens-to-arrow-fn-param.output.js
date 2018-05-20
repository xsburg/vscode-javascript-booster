/*$ { fixture: 'should-transform' } $*/

const a = (foo) => {};

/*$ { fixture: 'should-transform-and-set-selection', validateOutPos: true } $*/

const a = (foo) => {}; /*# { pos: 15 } #*/
