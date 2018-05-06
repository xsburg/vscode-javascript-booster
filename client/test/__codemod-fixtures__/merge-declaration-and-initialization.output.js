/*$ { fixture: 'should-merge' } $*/

let a = 'foo';

/*$ { fixture: 'should-merge-multiple-declarations' } $*/

let a = 'foo';
let b = 'bar';

/*$ { fixture: 'should-merge-into-assignments' } $*/

function test() {
    let c = 'baz';
    let a = 'foo';
    let b = 'bar';
}

/*$ { fixture: 'should-keep-initialized-declarators' } $*/

function test() {
    let a = 'foo';
    let c = 'baz';
    let b = 'bar';
}
