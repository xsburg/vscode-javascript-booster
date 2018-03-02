module.exports = (file, api, options) => {
  const j = api.jscodeshift;

  const printOptions = options.printOptions || {quote: 'single'};
  const root = j(file.source);
  const requires = {};

  const filterAndTransformRequires = path => {
    const varName = path.value.id.name;
    const requireName = path.value.init.arguments[0].value;
    const scopeNode = path.scope.node;

    // Check if we already have a require for this, if we do just use
    // that one.
    if (
      requires[requireName] &&
      requires[requireName].scopeNode === scopeNode
    ) {
      j(path).renameTo(requires[requireName].varName);
      j(path).remove();
      return true;
    }

    // We need this to make sure the JSX transform can use `React`
    if (requireName === 'React') {
      return false;
    }

    // Remove required vars that aren't used.
    const usages = j(path)
      .closestScope()
      .find(j.Identifier, {name: varName})
      // Ignore require vars
      .filter(identifierPath => identifierPath.value !== path.value.id)
      // Ignore properties in MemberExpressions
      .filter(identifierPath => {
        const parent = identifierPath.parent.value;
        return !(
          j.MemberExpression.check(parent) &&
          parent.property === identifierPath.value
        );
      });
    if (!usages.size()) {
      j(path).remove();
      return true;
    }

    requires[requireName] = {scopeNode, varName};
  };

  const didTransform = root
    .find(j.VariableDeclarator, {
      id: {type: 'Identifier'},
      init: {callee: {name: 'require'}},
    })
    .filter(filterAndTransformRequires)
    .size() > 0;

  return didTransform ? root.toSource(printOptions) : null;
};
