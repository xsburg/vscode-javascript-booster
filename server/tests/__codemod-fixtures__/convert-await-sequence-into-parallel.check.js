/*$ { fixture: 'should-trigger-simple-direct-case', expected: true } $*/

async function foo() {
    await bar('test'); /*# { anchorPos: 5 } #*/
    await bar('test'); /*# { activePos: 23 } #*/
}

/*$ { fixture: 'should-trigger-simple-reverse-case', expected: true } $*/

async function foo() {
    await bar('test'); /*# { activePos: 5 } #*/
    await bar('test'); /*# { anchorPos: 23 } #*/
}

/*$ { fixture: 'should-trigger-when-multiple-awaits', expected: true } $*/

async function foo() {
    await bar('test'); /*# { anchorPos: 5 } #*/
    await bar('test');
    await bar('test'); /*# { activePos: 23 } #*/
}

/*$ { fixture: 'should-trigger-with-assignment', expected: true } $*/

async function foo() {
    let result;
    await bar('test'); /*# { anchorPos: 5 } #*/
    result = await bar('test'); /*# { activePos: 32 } #*/
}

/*$ { fixture: 'should-trigger-with-var-declaration', expected: true } $*/

async function foo() {
    await bar('test'); /*# { anchorPos: 5 } #*/
    let result = await bar('test'); /*# { activePos: 36 } #*/
}

/*$ { fixture: 'should-trigger-with-incomplete-coverage', expected: true } $*/

async function foo() {
    await bar('test'); /*# { anchorPos: 13 } #*/
    let result = await bar('test'); /*# { activePos: 26 } #*/
}

/*$ { fixture: 'should-not-trigger-when-something-between', expected: false } $*/

async function foo() {
    await bar('test'); /*# { anchorPos: 5 } #*/
    let foo = 'bar';
    await bar('test'); /*# { activePos: 23 } #*/
}

/*$ { fixture: 'should-not-trigger-in-complex-declaration', expected: false } $*/

async function foo() {
    await bar('test'); /*# { anchorPos: 5 } #*/
    let a = await bar('test'), b = 2; /*# { activePos: 23 } #*/
}
