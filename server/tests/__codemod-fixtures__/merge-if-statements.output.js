/*$ { fixture: 'should-merge-two-ifs' } $*/

if (a && b) {
    doSomething();
}

/*$ { fixture: 'should-merge-multiple-ifs-down' } $*/

if (a && b && c) {
    doSomething();
}


/*$ { fixture: 'should-merge-multiple-ifs-up' } $*/

if (a && b && c) {
    doSomething();
}

/*$ { fixture: 'should-keep-comments' } $*/

{
    // comment above
    if (a && b && c) {
        doSomething();
    }
    // comment below
}
