module.exports = (file, api, options) => {
  const j = api.jscodeshift;
  const printOptions = options.printOptions || { quote: 'single' };
  const root = j(file.source);

  const rmObjectAssignCall = path =>
    j(path).replaceWith(
      j.objectExpression(
        path.value.arguments.reduce(
          (allProperties, { comments, ...argument }) => {
            if (argument.type === 'ObjectExpression') {
              const { properties } = argument;
              // Copy comments.
              if (properties.length > 0 && comments && comments.length > 0) {
                properties[0].comments = [
                  ...(properties[0].comments || []),
                  ...(comments || [])
                ];
              }
              return [...allProperties, ...properties];
            }

            return [...allProperties, { ...j.spreadProperty(argument), comments }];
          }, [])
      )
    );

  root
    .find(j.CallExpression, {
      callee: { object: { name: 'Object' }, property: { name: 'assign' } },
      arguments: [{ type: 'ObjectExpression' }]
    })
    .filter(p => !p.value.arguments.some(a => a.type === 'SpreadElement'))
    .forEach(rmObjectAssignCall);

  return root.toSource(printOptions);
};
