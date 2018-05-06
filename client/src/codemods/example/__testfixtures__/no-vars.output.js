/* eslint-disable one-var, prefer-const */

const module = require('module');

for (var i = 0; i < 10; i++) {

}

for (i = 0; i < 10; i++) {
}

let letItBe;
let shouldBeLet = 0;
const shouldBeConst = 0;

function mutate() {
  shouldBeLet = 1;
}

const array = ['a', 'b', 'c', 'd'];

for (const letter in array) {
  console.log(letter);
}

const object = {
  'a': 1,
  'b': 2,
  'c': 3,
  'd': 4,
};

for (const [key, value] of object.entries()) {
  console.log(key, value);
}

for (let [keyTwo, valueTwo] of object.entries()) {
  keyTwo = 'something';
  console.log(keyTwo, valueTwo);
}

let whileIterator = 10;
while (whileIterator > 0) {
  whileIterator--;
}

let z = 10;
do {
  let a = 0;
  const b = 1;
  a += b;
  console.log(a, b);
} while (z--);

(() => {
  let a = 1;

  return (() => {
    return _ = _ => _ => _ => _ => _ => { a = 7; };
  })();
})();

(() => {
  let a = 1, b = 2, c = 3;

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

  for (let k = 0; k < 10; k++) {
    console.log(i);
  }

  // I should be left alone
  for (let z = 0; z < 10; z++) {
    setTimeout(() => console.log(z));
  }
})();

(() => {
  let {foo, number} = bar;
  foo = xy;
  number++;
})();

(() => {
  // should not destroy comments
  let querySet = {};
  if (true) {
    ({querySet} = someComputation());
  }
})();

(() => {
  const {...foo} = bar;
  bar = foo;
  let {...foo2} = bar2;
  foo2 = bar2;
})();

(() => {
  const [first, ...rest] = foo;
  bar = foo;
  let [first2, ...rest2] = foo2;
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

const [, destructuringC, destructuringD] = whatever();

setSetByHoistedFunction();
var setByHoistedFunction;
function setSetByHoistedFunction() {
  setByHoistedFunction = 10;
}
console.log(setByHoistedFunction);

let mutatedInAFunction = 10;
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
  let {
    firstPropertyAsPartOfDeepDestructuring: {
      propertyExtractedFromDeepDestructuring,
    },
  } = objectToDeepDestructure;

  propertyExtractedFromDeepDestructuring = 10;
}
