/*$ { fixture: 'should-not-trigger', expected: false } $*/

const a = 1;

if (a) { 
    let b = 2; /*# { pos: 9 } #*/
} else {
    let c = 3;
}

/*$ { fixture: 'should-trigger', expected: true } $*/

const a = 1;

if (a) {
    let b = () => { /*# { pos: 17 } #*/
        return 2;
    };
} else {
    let c = 3;
}
