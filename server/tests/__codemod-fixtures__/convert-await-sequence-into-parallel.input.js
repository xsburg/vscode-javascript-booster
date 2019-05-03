/*$ { fixture: 'should-transform-simple-direct-case' } $*/

async function foo() {
    await bar('test'); /*# { anchorPos: 5 } #*/
    await bar('test'); /*# { activePos: 23 } #*/
}
