/*$ { fixture: 'should-merge' } $*/

let a; /*# { pos: 3 } #*/
a = 'foo';

/*$ { fixture: 'should-merge-multiple-declarations' } $*/

let a, b; /*# { pos: 3 } #*/
a = 'foo';
b = 'bar';

/*$ { fixture: 'should-merge-into-assignments' } $*/

function test() {
    let a, b; /*# { pos: 6 } #*/
    let c = 'baz';
    a = 'foo';
    b = 'bar';
}

/*$ { fixture: 'should-keep-initialized-declarators' } $*/

function test() {
    let a = 'foo', b; /*# { pos: 16 } #*/
    let c = 'baz';
    b = 'bar';
}
