import { union, has } from 'lodash';
import parse from './parsers';

const beforeView = (key, value) => `  - ${key}: ${value}`;
const afterView = (key, value) => `  + ${key}: ${value}`;
const unchgView = (key, value) => `    ${key}: ${value}`;

const diffCalc = (k, b, a) => {
  if (!has(b, k)) {
    return afterView(k, a[k]);
  }
  if (!has(a, k)) {
    return beforeView(k, b[k]);
  }
  if (b[k] === a[k]) {
    return unchgView(k, b[k]);
  }
  return [afterView(k, a[k]), beforeView(k, b[k])].join('\n');
};

const diff = (before, after) => {
  const beforeObject = parse(before);
  const afterObject = parse(after);
  const diffStr = union(Object.keys(beforeObject), (Object.keys(afterObject)))
    .map(k => diffCalc(k, beforeObject, afterObject));
  return ['{', ...diffStr, '}'].join('\n');
};
export default diff;
