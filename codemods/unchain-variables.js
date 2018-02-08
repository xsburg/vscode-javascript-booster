/**
 * Unchains chained variable declarations.
 */
module.exports = function(file, api, options) {
  const jscodeshift = api.jscodeshift;
  const printOptions = options.printOptions || {quote: 'single'};

  const chainedDeclarations = jscodeshift(file.source)
    .find(jscodeshift.VariableDeclaration)
    .filter(variableDeclaration => (
      variableDeclaration.value.declarations.length > 1
    ))
    .filter(variableDeclaration => (
      variableDeclaration.parent.value.type !== 'ForStatement'
    ));

  chainedDeclarations.forEach(chainedDeclaration => {
    const kind = chainedDeclaration.value.kind; // e.g. const, let, or var

    jscodeshift(chainedDeclaration)
      .replaceWith(chainedDeclaration.value.declarations.map((declaration, i) => {
        const unchainedDeclaration =
          jscodeshift.variableDeclaration(kind, [declaration]);

        if (i === 0) {
          unchainedDeclaration.comments = chainedDeclaration.value.comments;
        } else if (declaration.comments) {
          unchainedDeclaration.comments = declaration.comments;
          declaration.comments = null;
        }

        return unchainedDeclaration;
      }));
  });

  return chainedDeclarations.size()
    ? chainedDeclarations.toSource(printOptions)
    : null;
};
