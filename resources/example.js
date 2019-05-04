async function load() {
    prepareThings();

    await mkdir('dir1');
    await mkdir('dir2');
    let result = await api.doHardWork();

    return result;
}

function convertIfElseExpression() {
    if (conditionMet()) {
        this.runAction();
    } else {
        this.resetSequence();
    }
}

function removeRedundantElseCaseReturn() {
    if (conditionMet()) {
        foo();
        return;
    } else {
        bar();
    }
}

function replaceIfElseWithTernaryCaseReturn() {
    if (conditionMet()) {
        return foo;
    } else {
        return bar;
    }
}

function simplifyTernary() {
    let foo = true ? 1 : 0;
    let bar = conditionMet() ? true : false;
    let baz = a ? a : b;
}

function simplifyIfElse() {
    if (false) {
        foo();
    } else {
        bar();
    }

    if (cond) {
        return true;
    } else {
        return false;
    }
}
