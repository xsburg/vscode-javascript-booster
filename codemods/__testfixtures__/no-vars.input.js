/* eslint-disable one-var, prefer-const */

var module = require('module');

for (var i = 0; i < 10; i++) {

}

for (i = 0; i < 10; i++) {
}

var letItBe;
var shouldBeLet = 0;
var shouldBeConst = 0;

function mutate() {
  shouldBeLet = 1;
}

var array = ['a', 'b', 'c', 'd'];

for (var letter in array) {
  console.log(letter);
}

var object = {
  'a': 1,
  'b': 2,
  'c': 3,
  'd': 4,
};

for (var [key, value] of object.entries()) {
  console.log(key, value);
}

for (var [keyTwo, valueTwo] of object.entries()) {
  keyTwo = 'something';
  console.log(keyTwo, valueTwo);
}

var whileIterator = 10;
while (whileIterator > 0) {
  whileIterator--;
}

var z = 10;
do {
  var a = 0;
  var b = 1;
  a += b;
  console.log(a, b);
} while (z--);

(() => {
  var a = 1;

  return (() => {
    return _ = _ => _ => _ => _ => _ => { a = 7; };
  })();
})();

(() => {
  var a = 1, b = 2, c = 3;

  a++;

  return b + a;
})();

(() => {
  for (var i = 0, z = 77; i < 10; i++) {
    setTimeout(() => console.log(i));
  }

  for (var j = 0; j < 10; j++) {
    _.defer(function() {
      console.log(j);
    });
  }

  for (var k = 0; k < 10; k++) {
    console.log(i);
  }

  // I should be left alone
  for (let z = 0; z < 10; z++) {
    setTimeout(() => console.log(z));
  }
})();

(() => {
  var {foo, number} = bar;
  foo = xy;
  number++;
})();

(() => {
  // should not destroy comments
  var querySet = {};
  if (true) {
    ({querySet} = someComputation());
  }
})();

(() => {
  var {...foo} = bar;
  bar = foo;
  var {...foo2} = bar2;
  foo2 = bar2;
})();

(() => {
  var [first, ...rest] = foo;
  bar = foo;
  var [first2, ...rest2] = foo2;
  rest2 = foo2;
})();

var myDoubleLet = 10;
myDoubleLet++;
var myDoubleLet = 20;
myDoubleLet++;

var myFakeConstant = 10;
var myFakeConstant = 20;

if (true) {
  var blockScopeAbuse = 10;
}
console.log(blockScopeAbuse);

console.log(usedTooEarly);
var usedTooEarly = 10;

for (var dangerousLoop = 0; dangerousLoop < 10; dangerousLoop++) {
  setTimeout(() => {
    console.log(dangerousLoop);
  }, 100);
}

console.log(destructuringAlias);
var {destructuringToBeAliased: destructuringAlias} = whatever();

var {destructuringB} = whatever();
var {destructuringB} = whateverElse();

var [, destructuringC, destructuringD] = whatever();

setSetByHoistedFunction();
var setByHoistedFunction;
function setSetByHoistedFunction() {
  setByHoistedFunction = 10;
}
console.log(setByHoistedFunction);

var mutatedInAFunction = 10;
function mutateMutatedInAFunction() {
  mutatedInAFunction = 20;
}
if (true) {
  var usedInAFunction = 10;
}
function useUsedInAFunction() {
  console.log(usedInAFunction);
}


function jasklfjasklfjdsakl() {
  var {
    firstPropertyAsPartOfDeepDestructuring: {
      propertyExtractedFromDeepDestructuring,
    },
  } = objectToDeepDestructure;

  propertyExtractedFromDeepDestructuring = 10;
}
