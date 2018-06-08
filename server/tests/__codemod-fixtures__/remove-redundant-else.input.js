/*$ { fixture: 'should-remove-else' } $*/

const a = 1;

if (a) { /*# { pos: 2 } #*/
    let b = 2;
} else {
}

/*$ { fixture: 'should-remove-else-when-if-returns' } $*/

function test() {
    if (true) {
        let b = 2;
        return;
    } else {  /*# { pos: 8 } #*/
        let b = 3;
    }
}
