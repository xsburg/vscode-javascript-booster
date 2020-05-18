/*$ { fixture: 'should-merge-two-ifs' } $*/

if (a) { /*# { pos: 2 } #*/
    if (b) {
        doSomething();
    }
}

/*$ { fixture: 'should-merge-multiple-ifs-down' } $*/

if (a) { /*# { pos: 2 } #*/
    if (b) {
        if (c) {
            doSomething();
        }
    }
}


/*$ { fixture: 'should-merge-multiple-ifs-up' } $*/

if (a) {
    if (b) {
        if (c) { /*# { pos: 10 } #*/
            doSomething();
        }
    }
}
