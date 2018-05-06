/*$ { fixture: 'should-flip-ternary-expression' } $*/

const a = 1;

const b = !a ? 2 : 1;

/*$ { fixture: 'should-layout-long-expressions' } $*/

const selector = window.selector;

const b = !selector.subspace.isConnectedToLongDatabaseName()
    ? selector.subspace.tryToReconnectAsSoonAsPossible()
    : selector.subspace.getNearestReceiverPost();
