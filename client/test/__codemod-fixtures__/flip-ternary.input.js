/*$ { fixture: 'should-flip-ternary-expression' } $*/

const a = 1;

const b = a ? 1 : 2; /*# { pos: 13 } #*/

/*$ { fixture: 'should-layout-long-expressions' } $*/

const selector = window.selector;

const b = selector.subspace.isConnectedToLongDatabaseName()
    ? selector.subspace.getNearestReceiverPost() /*# { pos: 5 } #*/
    : selector.subspace.tryToReconnectAsSoonAsPossible();
