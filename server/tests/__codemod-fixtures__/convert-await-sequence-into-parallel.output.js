/*$ { fixture: 'should-transform-simple-direct-case' } $*/

async function foo() {
    await Promise.all([bar('test'), bar('test')]);
}

/*$ { fixture: 'should-transform-multiple-statements' } $*/

async function foo() {
    await Promise.all([bar('test'), bar('test'), bar('test')]);
}

/*$ { fixture: 'should-transform-assignments' } $*/

async function foo() {
    let result;
    [, result] = await Promise.all([bar('test'), bar('test'), bar('test')]);
}

/*$ { fixture: 'should-transform-var-declarations' } $*/

async function foo() {
    let [, result] = await Promise.all([bar('test'), bar('test'), bar('test')]);
}
