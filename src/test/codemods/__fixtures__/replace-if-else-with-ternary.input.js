/*$ { fixture: 'should-transform' } $*/

function test() {
    let a;
    let b = true;
    if (b) {
        a = 1; /*# { pos: 10 } #*/
    } else {
        a = 0;
    }
}
