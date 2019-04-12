/*$ { fixture: 'should-transform' } $*/

const el = <div className="foo-bar"></div>;

/*$ { fixture: 'should-transform-and-set-selection', validateOutPos: true } $*/

const el = <div className="foo-bar"></div>; /*# { pos: 37 } #*/
