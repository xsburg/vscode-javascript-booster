/**
 * Replaces string concatenation with template literals.
 * Adapted from https://vramana.github.io/blog/2015/12/21/codemod-tutorial/
 *
 * Areas of improvement:
 *
 * - Comments in the middle of string concatenation are currently added before
 *   the string but after the assignment. Perhaps in these situations, the
 *   string concatenation should be preserved as-is.
 *
 * - Nested concatenation inside template literals is not currently simplified.
 *   Currently, a + `b${'c' + d}` becomes `${a}b${'c' + d}` but it would ideally
 *   become `${a}b${`c${d}`}`.
 *
 * - Unnecessary escaping of quotes from the resulting template literals is
 *   currently not removed. This is possibly the domain of a different
 *   transform.
 *
 * - Unicode escape sequences are converted to unicode characters when
 *   the simplified concatenation results in a string literal instead of a
 *   template literal. It would be nice to perserve the original--whether it be
 *   a unicode escape sequence or a unicode character.
 */
module.exports = function templateLiterals(file, api, options) {
  const j = api.jscodeshift;
  const printOptions = options.printOptions || {quote: 'single'};

  function extractNodes(node, comments, topLevel = false) {
    if (comments) {
      node.comments = node.comments || [];
      node.comments.push(...comments);
    }

    if (node.type !== 'BinaryExpression') {
      return [node];
    }

    if (node.operator !== '+') {
      return [node];
    }

    if (!topLevel && node.parenthesizedExpression) {
      return [node];
    }

    // We need to be careful about not having a stringish node on the left to
    // prevent things like 1 + 2 + 'foo', which should evaluate to '3foo' from
    // becoming '12foo'.
    return [
      ...(hasStringish(node.left) ? extractNodes(node.left) : [node.left]),
      ...extractNodes(node.right, node.comments),
    ];
  }

  function isStringNode(node) {
    return node.type === 'Literal' && (typeof node.value === 'string');
  }

  function isCastToStringNode(node) {
    // foo.toString()
    if (
      node.type === 'CallExpression' &&
      node.callee.type === 'MemberExpression' &&
      node.callee.property.type === 'Identifier' &&
      node.callee.property.name === 'toString'
    ) {
      return true;
    }

    // String(foo) and new String(foo)
    if (
      ['CallExpression', 'NewExpression'].indexOf(node.type) !== -1 &&
      node.callee.type === 'Identifier' &&
      node.callee.name === 'String'
    ) {
      return true;
    }

    return false;
  }

  function isTemplateLiteralNode(node) {
    return node.type === 'TemplateLiteral';
  }

  function isBinaryExpressionNode(node) {
    return node.type === 'BinaryExpression';
  }

  function isStringishNode(node) {
    return (
      isStringNode(node) ||
      isTemplateLiteralNode(node) ||
      isCastToStringNode(node)
    );
  }

  function hasStringish(node) {
    if (isBinaryExpressionNode(node)) {
      return hasStringish(node.left) || hasStringish(node.right);
    }

    return isStringishNode(node);
  }

  function joinQuasis(leftQuasis, rightQuasis) {
    const lastQuasi = leftQuasis.pop();

    if (lastQuasi) {
      rightQuasis[0] = j.templateElement({
        cooked: lastQuasi.value.cooked + rightQuasis[0].value.cooked,
        raw: lastQuasi.value.raw + rightQuasis[0].value.raw,
      }, false);
    }

    return leftQuasis.concat(rightQuasis);
  }

  function buildTL(nodes, quasis = [], expressions = [], comments = []) {
    if (nodes.length === 0) {
      return { quasis, expressions, comments };
    }

    const [node, ...rest] = nodes;

    const newComments = comments.concat(node.comments || []);

    if (node.type === 'Literal') {
      const cooked = node.value.toString();
      let raw = node.raw.toString();
      if (typeof node.value === 'string') {
        // We need to remove the opening and trailing quote from the raw value
        // of the string.
        raw = raw.slice(1, -1);

        // We need to escape ${ to prevent new interpolation.
        raw = raw.replace(/\$\{/g, '\\${');
      }

      const newQuasi = j.templateElement({ cooked, raw }, false);
      const newQuasis = joinQuasis(quasis, [newQuasi]);
      return buildTL(rest, newQuasis, expressions, newComments);
    }

    if (node.type === 'TemplateLiteral') {
      const nodeQuasis = node.quasis.map((q) => (
        j.templateElement({
          cooked: q.value.cooked,
          raw: q.value.raw,
        }, false)
      ));

      // We need to join the last quasi and the next quasi to prevent
      // expressions from shifting.
      const newQuasis = joinQuasis(quasis, nodeQuasis);
      const newExpressions = expressions.concat(node.expressions);
      return buildTL(rest, newQuasis, newExpressions, newComments);
    }

    const newQuasis = joinQuasis(quasis, [
      j.templateElement({ cooked: '', raw: '' }, false),
      j.templateElement({ cooked: '', raw: '' }, false),
    ]);
    const newExpressions = expressions.concat(node);

    return buildTL(rest, newQuasis, newExpressions, newComments);
  }

  function convertToTemplateString(p) {
    const tempNodes = extractNodes(p.node, null, true);

    if (!tempNodes.some(isStringishNode)) {
      return p.node;
    }

    const tlOptions = buildTL(tempNodes);
    const tl = j.templateLiteral(tlOptions.quasis, tlOptions.expressions);
    if (tl.expressions.length > 0) {
      tl.comments = tlOptions.comments;
      return tl;
    }

    // There are no expressions, so let's use a regular string instead of a
    // template literal.
    const str = tl.quasis.map(q => q.value.cooked).join('');
    const strLiteral = j.literal(str);
    strLiteral.comments = tlOptions.comments;
    return strLiteral;
  }

  return j(file.source)
    .find(j.BinaryExpression, { operator: '+' })
    .replaceWith(convertToTemplateString)
    .toSource(printOptions);
};
