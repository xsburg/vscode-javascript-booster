/*$ { fixture: 'should-trigger', expected: true } $*/

async function foo() {
    await bar('test');
    await bar('test'); /*# { pos: 6 } #*/
}
