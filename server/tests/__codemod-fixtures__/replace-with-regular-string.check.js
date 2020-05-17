/*$ { fixture: 'should-trigger-at-template-literal', expected: true } $*/

const a = `foo`; /*# { pos: 14 } #*/

/*$ { fixture: 'should-trigger-at-template-with-expressions', expected: true } $*/

const a = 'foo';
const b = `${foo}bar`; /*# { pos: 16 } #*/

/*$ { fixture: 'should-not-trigger-on-tagged-template-strings', expected: false } $*/

const a = styled.div`
    background: #fff; /*# { pos: 17 } #*/
`;

/*$ { fixture: 'should-not-trigger-anywhere-else', expected: false } $*/

const a = 'foo'; /*# { pos: 7 } #*/
