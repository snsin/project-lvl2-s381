import { has, union, find } from 'lodash';

const isNested = (b, a, k) => has(b, k) && has(a, k)
  && (b[k] instanceof Object) && (a[k] instanceof Object);

const isOnlyOneObject = (b, a) => (b instanceof Object) !== (a instanceof Object);
const isBothNotObject = (b, a) => !(b instanceof Object) && !(a instanceof Object);

const typeSelector = [
  {
    type: 'added',
    predicate: (key, before, after) => !has(before, key) && has(after, key),
    create: (beforeValue, value) => value,
  },
  {
    type: 'deleted',
    predicate: (key, before, after) => has(before, key) && !has(after, key),
    create: value => value,
  },
  {
    type: 'changed',
    predicate: (key, before, after) => (isBothNotObject(before[key], after[key])
      && (before[key] !== after[key])) || isOnlyOneObject(before[key], after[key]),
    create: (oldValue, newValue) => ({ newValue, oldValue }),
  },
  {
    type: 'unchanged',
    predicate: (key, before, after) => (isBothNotObject(before[key], after[key])
      && (before[key] === after[key])),
    create: value => value,
  },
  {
    type: 'nested',
    predicate: (key, before, after) => isNested(before, after, key),
    create: (before, after, fn) => fn(before, after),
  },
];

const diffCalculation = (b, a) => {
  const keys = union(Object.keys(b), (Object.keys(a)));
  return keys.map((key) => {
    const { type, create } = find(typeSelector, typeInst => typeInst.predicate(key, b, a));
    return { type, key, value: create(b[key], a[key], diffCalculation) };
  });
};

export default diffCalculation;
