/*$ { fixture: 'should-remove-else' } $*/

const a = 1;

if (a) {
    let b = 2;
}

/*$ { fixture: 'should-remove-else-when-if-returns' } $*/

function test() {
    if (true) {
        let b = 2;
        return;
    }
    let b = 3;
}
