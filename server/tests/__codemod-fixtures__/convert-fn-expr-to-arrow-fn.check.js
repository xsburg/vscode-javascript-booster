/*$ { fixture: 'should-not-trigger-when-has-this', expected: false } $*/

const a = function() { /*# { pos: 14 } #*/
    this.bar = 2;
};

/*$ { fixture: 'should-not-trigger-when-inside-fn', expected: false } $*/

const a = function() {
    this.bar = 2; /*# { pos: 14 } #*/
};

/*$ { fixture: 'should-trigger-when-no-this', expected: true } $*/

const a = function() { /*# { pos: 14 } #*/
}

/*$ { fixture: 'should-not-trigger-when-inside-bind-expr', expected: false } $*/

const a = function() {
    this.bar = 2; /*# { pos: 14 } #*/
}.bind(this)

/*$ { fixture: 'should-trigger-when-bound-this', expected: true } $*/

const a = function() { /*# { pos: 14 } #*/
    this.bar = 2;
}.bind(this)

/*$ { fixture: 'should-not-trigger-when-generator', expected: false } $*/

const a = function*() { /*# { pos: 14 } #*/
}

/*$ { fixture: 'should-not-trigger-when-bound-this-generator', expected: false } $*/

const a = function*() { /*# { pos: 14 } #*/
    this.bar = 2;
}.bind(this)
