/*$ { fixture: 'should-trigger-when-no-this' } $*/

const a = () => {
    let foo = 'foo';
};

/*$ { fixture: 'should-trigger-when-bound-this' } $*/

const a = () => {
    this.bar = 'bar';
};

/*$ { fixture: 'should-transform-async-properly' } $*/

const a = async () => {
    let foo = 'foo';
};
