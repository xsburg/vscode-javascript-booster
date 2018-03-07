/*$ { fixture: 'should-remove-else' } $*/

const a = 1;

if (a) { /*# { pos: 2 } #*/
    let b = 2;
} else {
}
