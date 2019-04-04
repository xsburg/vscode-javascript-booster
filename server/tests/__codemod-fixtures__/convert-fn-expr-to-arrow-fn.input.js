/*$ { fixture: 'should-trigger-when-no-this' } $*/

const a = function() { /*# { pos: 14 } #*/
    let foo = 'foo';
};

/*$ { fixture: 'should-trigger-when-bound-this' } $*/

const a = function() { /*# { pos: 14 } #*/
    this.bar = 'bar';
}.bind(this);

/*$ { fixture: 'should-transform-async-properly' } $*/

const a = async function() { /*# { pos: 14 } #*/
    let foo = 'foo';
}.bind(this);
