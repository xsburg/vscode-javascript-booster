/*$ { fixture: 'should-trigger-on-first-if', expected: true } $*/

if (foo) { /*# { pos: 2 } #*/
    if (bar) {
        doSomething();
    }
}

/*$ { fixture: 'should-trigger-on-second-if', expected: true } $*/

if (foo) {
    if (bar) { /*# { pos: 6 } #*/
        doSomething();
    }
}

/*$ { fixture: 'should-not-trigger-when-there-are-other-statements', expected: false } $*/

if (foo) { /*# { pos: 2 } #*/
    if (bar) {
        doSomething();
    }
    doThat();
}

/*$ { fixture: 'should-not-trigger-when-else-statement-on-if1', expected: false } $*/

if (foo) {
    if (bar) { /*# { pos: 6 } #*/
        doSomething();
    }
} else {
    doThat();
}

/*$ { fixture: 'should-not-trigger-when-else-statement-on-if2', expected: false } $*/

if (foo) {
    if (bar) { /*# { pos: 6 } #*/
        doSomething();
    } else {
        doThat();
    }
}
