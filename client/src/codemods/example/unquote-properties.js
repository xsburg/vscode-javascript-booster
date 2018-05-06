/**
 * Removes quotes from object properties whose keys are strings which are valid
 * identifiers. Does not handle quoted methods.
 */
module.exports = (file, api, options) => {
  const j = api.jscodeshift;
  const printOptions = options.printOptions || {quote: 'single'};
  const root = j(file.source);

  const isValidIdentifierNameForProperty = (name) => {
    try {
      new Function(`({${name}: 1})`)(); //eslint-disable-line no-new-func
    } catch (e) {
      return false;
    }

    return true;
  };

  root
    .find(j.Property, {
      method: false,
      computed: false,
    })
    .filter(p => (
      p.value.key.type === 'Literal' &&
      typeof p.value.key.value === 'string' &&
      isValidIdentifierNameForProperty(p.value.key.value)
    ))
    .forEach(p => p.value.key = j.identifier(p.value.key.value));

  return root.toSource(printOptions);
};
