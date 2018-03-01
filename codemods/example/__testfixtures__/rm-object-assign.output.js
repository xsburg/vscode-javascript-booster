let x = {
  a: 1,
  b: 2,
};

({
  ...a,
});

({
  a: 1,
  ...b,
  c: 3,
});

Object.assign(a, b);

Object.assign({}, ...b);

({
  // comment 1
  a: 1,

  // comment 2
  b: 2,

  // comment 3
  ...c,

  ...d /* comment 4 */,
});
