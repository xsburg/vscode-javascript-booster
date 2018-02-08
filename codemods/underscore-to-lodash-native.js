const DEFAULT_OPTIONS = {
  'split-imports': false,
};

const NATIVE_METHODS = {
  forEach: 'forEach',
  each: 'forEach',
  map: 'map',
  collect: 'map',
  filter: 'filter',
  select: 'filter',
  every: 'every',
  some: 'some',
  find: 'find',
  detect: 'find',
  contains: 'includes',
  reduce: 'reduce',
  inject: 'reduce',
  indexOf: 'indexOf',
  lastIndexOf: 'lastIndexOf',
  first: (j, identifier) => j.memberExpression(identifier, j.literal(0)),
  last: (j, identifier) => j.memberExpression(identifier,
    j.binaryExpression('-',
      j.memberExpression(identifier, j.identifier('length')),
      j.literal(1)
    )
  ),
};

/**
 * This codemod does a few different things.
 * 1. Convert all underscore imports/requires to lodash imports
 *    const _ = require('underscore') -> import _ from 'lodash'
 * 2. Remove native equivalents
 *    _.forEach(array, fn) -> array.forEach(fn)
 * 3. Remove unused imports after #2
 * 4. Use partial imports from lodash to allow tree-shaking
 *    import _ from 'lodash' -> import {find} from 'lodash'
 *
 * Issues:
 * 1. Does not check for variables with same name in scope
 * 2. Knows nothing of types, so objects using _ methods will break
 */
module.exports = function(fileInfo, { jscodeshift: j }, argOptions) {
  const options = Object.assign({}, DEFAULT_OPTIONS, argOptions);
  const ast = j(fileInfo.source);
  // Cache opening comments/position
  const { comments, loc } = ast.find(j.Program).get('body', 0).node;
  // Cache of underscore methods used
  j.__methods = {};

  ast // Iterate each _.<method>() usage
    .find(j.CallExpression, isUnderscoreExpression)
    .forEach(transformExpression(j, options));

  ast // const _ = require('underscore')
    .find(j.VariableDeclaration, isUnderscoreRequire)
    .forEach(transformRequire(j, options));
  
  ast // const _ = require('lodash')
    .find(j.VariableDeclaration, isLodashRequire)
    .forEach(transformRequire(j, options));

  ast // import _ from 'underscore'
    .find(j.ImportDeclaration, isUnderscoreImport)
    .forEach(transformImport(j, options));
  
  ast // import _ from 'lodash'
    .find(j.ImportDeclaration, isLodashImport)
    .forEach(transformImport(j, options));

  // Restore opening comments/position
  Object.assign(ast.find(j.Program).get('body', 0).node, { comments, loc });

  return ast.toSource({
    arrowParensAlways: true,
    quote: 'single',
  });
};

function isUnderscoreExpression(node) {
  return (
    node.type === 'CallExpression' &&
    node.callee.type === 'MemberExpression' &&
    node.callee.object &&
    node.callee.object.name === '_'
  );
}

function isRequire(node, required) {
  return (
    node.type === 'VariableDeclaration' &&
    node.declarations.length > 0 &&
    node.declarations[0].type === 'VariableDeclarator' &&
    node.declarations[0].init &&
    node.declarations[0].init.type === 'CallExpression' &&
    node.declarations[0].init.callee &&
    node.declarations[0].init.callee.name === 'require' &&
    node.declarations[0].init.arguments[0].value === required
  );
}

function isUnderscoreRequire(node) {
  return isRequire(node, 'underscore');
}

function isLodashRequire(node) {
  return isRequire(node, 'lodash');
}


function isImport(node,imported) {
  return (
    node.type === 'ImportDeclaration' &&
    node.source.value === imported
  );
}

function isUnderscoreImport(node) {
  return isImport(node, 'underscore');
}

function isLodashImport(node) {
  return isImport(node, 'lodash');
}

function transformExpression(j, options) {
  return (ast) => {
    const methodName = ast.node.callee.property.name;
    const nativeMapping = NATIVE_METHODS[methodName];
    if (nativeMapping) {
      if (typeof nativeMapping === 'function') {
        transformNativeSpecial(j, ast);
      } else {
        transformNativeMethod(j, ast);
      }
    } else {
      transformUnderscoreMethod(j, ast);
    }
  };
}

function transformNativeSpecial(j, ast) {
  const methodName = ast.node.callee.property.name;
  const nativeMapping = NATIVE_METHODS[methodName];
  j(ast).replaceWith(nativeMapping(j, ast.node.arguments[0]));
}

function transformNativeMethod(j, ast) {
  const methodName = ast.node.callee.property.name;
  const nativeMapping = NATIVE_METHODS[methodName];
  j(ast).replaceWith(
    j.callExpression(
      j.memberExpression(
        ast.node.arguments[0], j.identifier(nativeMapping)
      ),
      ast.node.arguments.slice(1)
    )
  );
}

function transformUnderscoreMethod(j, ast) {
  const methodName = ast.node.callee.property.name;
  j.__methods[methodName] = true;
  j(ast).replaceWith(
    j.callExpression(j.identifier(methodName), ast.node.arguments)
  );
}

function transformRequire(j, options) {
  const imports = Object.keys(j.__methods);
  return (ast) => {
    if (imports.length === 0) {
      j(ast).remove();
    } else if (options['split-imports']) {
      j(ast).replaceWith(buildSplitImports(j, imports));
    } else {
      j(ast).replaceWith(
        j.importDeclaration(getImportSpecifiers(j, imports), j.literal('lodash'))
      );
    }
  };
}

function transformImport(j, options) {
  const imports = Object.keys(j.__methods);
  return (ast) => {
    ast.node.source = j.literal('lodash');
    if (imports.length === 0) {
      j(ast).remove();
    } else if (options['split-imports']) {
      j(ast).replaceWith(buildSplitImports(j, imports));
    } else {
      ast.node.specifiers = getImportSpecifiers(j, imports);
    }
  };
}

function buildSplitImports(j, imports) {
  return imports.map(name => {
    return j.importDeclaration([j.importDefaultSpecifier(j.identifier(name))], j.literal(`lodash/${name}`));
  });
}

function getImportSpecifiers(j, imports) {
  return imports.map(name => {
    return j.importSpecifier(j.identifier(name));
  });
}
