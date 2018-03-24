/*$ { fixture: 'should-trigger', expected: true } $*/

const a = foo => {}; /*# { pos: 12 } #*/

/*$ { fixture: 'should-not-trigger-when-has-parens', expected: false } $*/

const a = (foo) => {}; /*# { pos: 14 } #*/

/*$ { fixture: 'should-not-trigger-when-length-isnt-one', expected: false } $*/

const a = (foo, bar) => {}; /*# { pos: 14 } #*/

/*$ { fixture: 'should-not-trigger-when-inside-body', expected: false } $*/

const a = foo => {
    let b = 'bar'; /*# { pos: 9 } #*/
};
