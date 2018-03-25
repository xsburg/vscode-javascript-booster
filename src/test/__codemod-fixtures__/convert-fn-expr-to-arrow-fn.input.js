/*$ { fixture: 'should-trigger-when-no-this' } $*/

const a = function() { /*# { pos: 14 } #*/
    let foo = 'foo';
};

/*$ { fixture: 'should-trigger-when-bound-this' } $*/

const a = function() { /*# { pos: 14 } #*/
    this.bar = 'bar';
}.bind(this);
