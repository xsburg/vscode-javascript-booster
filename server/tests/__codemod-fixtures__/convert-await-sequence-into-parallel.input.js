/*$ { fixture: 'should-transform-simple-direct-case' } $*/

async function foo() {
    await bar('test'); /*# { anchorPos: 5 } #*/
    await bar('test'); /*# { activePos: 23 } #*/
}

/*$ { fixture: 'should-transform-multiple-statements' } $*/

async function foo() {
    await bar('test'); /*# { anchorPos: 5 } #*/
    await bar('test');
    await bar('test'); /*# { activePos: 23 } #*/
}

/*$ { fixture: 'should-transform-assignments' } $*/

async function foo() {
    let result;
    await bar('test'); /*# { anchorPos: 5 } #*/
    result = await bar('test');
    await bar('test'); /*# { activePos: 23 } #*/
}

/*$ { fixture: 'should-transform-var-declarations' } $*/

async function foo() {
    await bar('test'); /*# { anchorPos: 5 } #*/
    let result = await bar('test');
    await bar('test'); /*# { activePos: 23 } #*/
}
