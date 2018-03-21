/*$ { fixture: 'should-trigger', expected: true } $*/

import React from 'react';

{
    const data = <div className={'foo'}></div>; /*# { pos: 36 } #*/
}

/*$ { fixture: 'should-not-trigger', expected: false } $*/

import React from 'react';

{
    const data = <div className="foo"></div>; /*# { pos: 35 } #*/
}
