/*$ { fixture: 'should-transform-simple-direct-case' } $*/

async function foo() {
    await Promise.all([bar('test'), bar('test')]);
}
