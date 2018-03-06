const a = 1;
let b = 2;
let c = 3;

if (a) {
    [b, c] = [c, b];
} else {
    b = c;
}
