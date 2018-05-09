/*$ { fixture: 'over-if', expected: true } $*/

const a = 1;
let b = 2;
let c = 3;

if (a) { /*# { pos: 2 } #*/
    [b, c] = [c, b];
} else {
    b = c;
}

/*$ { fixture: 'not-if', expected: false } $*/

const a = 1;
let b = 2;
let c = 3;

if (a) {
    [b, c] = [c, b]; /*# { pos: 9 } #*/
} else {
    b = c;
}
