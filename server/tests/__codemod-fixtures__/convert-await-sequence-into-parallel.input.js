/*$ { fixture: 'should-transform-start' } $*/

async function foo() {
    await bar('test');
    await bar('test'); /*# { pos: 6 } #*/
}

/*$ { fixture: 'should-transform-end' } $*/

async function foo() {
    await bar('test');
    await bar('test'); /*# { pos: 6 } #*/
}

/*$ { fixture: 'should-transform-middle' } $*/

async function foo() {
    await bar('test');
    await bar('test'); /*# { pos: 6 } #*/
    await bar('test');
}
