module.exports = (file, api, options) => {
  const j = api.jscodeshift;

  const printOptions = options.printOptions || {quote: 'single'};
  const root = j(file.source);

  const getBodyStatement = fn => {
    // 79 characters fit on a line of length 80
    const maxWidth = options['max-width'] ? options['max-width'] - 1 : undefined;

    if (
      fn.body.type == 'BlockStatement' &&
      fn.body.body.length == 1
    ) {
      const inner = fn.body.body[0];
      const comments = (fn.body.comments || []).concat(inner.comments || []);

      if (
        options['inline-single-expressions'] &&
        inner.type == 'ExpressionStatement'
      ) {
        inner.expression.comments = (inner.expression.comments || []).concat(comments);
        return inner.expression;
      } else if (inner.type == 'ReturnStatement') {
        const lineStart = fn.loc.start.line;
        const originalLineLength = fn.loc.lines.getLineLength(lineStart);
        const approachDifference = 'function(a, b) {'.length - '(a, b) => );'.length;
        const argumentLength = inner.argument.end - inner.argument.start;

        const newLength = originalLineLength + argumentLength - approachDifference;
        const tooLong = maxWidth && newLength > maxWidth;

        if (!tooLong) {
          inner.argument.comments = (inner.argument.comments || []).concat(comments);
          return inner.argument;
        }
      }
    }
    return fn.body;
  };

  const createArrowFunctionExpression = fn => {
    const arrowFunction = j.arrowFunctionExpression(
      fn.params,
      getBodyStatement(fn),
      false
    );
    arrowFunction.comments = fn.comments;
    return arrowFunction;
  };

  const replacedBoundFunctions = root
    .find(j.CallExpression, {
      callee: {
        type: 'MemberExpression',
        object: {
          type: 'FunctionExpression',
        },
        property: {
          type: 'Identifier',
          name: 'bind',
        },
      },
    })
    .filter(path => (
      !path.value.callee.object.id &&
      path.value.arguments &&
      path.value.arguments.length == 1 &&
      path.value.arguments[0].type == 'ThisExpression'
    ))
    .forEach(path => {
      const comments = path.value.comments || [];
      for (const node of [path.value.callee, path.value.callee.property, path.value.arguments[0]]) {
        for (const comment of node.comments || []) {
          comment.leading = false;
          comment.trailing = true;
          comments.push(comment);
        }
      }
      const arrowFunction = createArrowFunctionExpression(path.value.callee.object);
      arrowFunction.comments = (arrowFunction.comments || []).concat(comments);
      j(path).replaceWith(arrowFunction);
    })
    .size() > 0;

  const replacedCallbacks = root
    .find(j.FunctionExpression)
    .filter(path => {
      const isArgument = path.parentPath.name === 'arguments' && path.parentPath.value.indexOf(path.value) > -1;
      const noThis = j(path).find(j.ThisExpression).size() == 0;
      const notNamed = !path.value.id || !path.value.id.name;
      const noArgumentsRef = j(path).find(j.Identifier).filter(idPath => idPath.node.name === 'arguments' && idPath.scope.depth === path.get('body').scope.depth).size() === 0;

      return isArgument && noThis && notNamed && noArgumentsRef;
    })
    .forEach(path =>
      j(path).replaceWith(
        createArrowFunctionExpression(path.value)
      )
    )
    .size() > 0;

  return replacedBoundFunctions || replacedCallbacks ? root.toSource(printOptions) : null;
};
