/*$ { fixture: 'should-transform-start' } $*/

async function foo() {
    await Promise.all([bar('test'), bar('test')]);
}

/*$ { fixture: 'should-transform-end' } $*/

async function foo() {
    await Promise.all([bar('test'), bar('test')]);
}

/*$ { fixture: 'should-transform-middle' } $*/

async function foo() {
    await Promise.all([bar('test'), bar('test'), bar('test')]);
}
