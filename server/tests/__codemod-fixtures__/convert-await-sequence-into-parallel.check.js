/*$ { fixture: 'should-trigger', expected: true } $*/

async function foo() {
    await bar('test'); /*# { anchorPos: 5 } #*/
    await bar('test'); /*# { activePos: 23 } #*/
}
