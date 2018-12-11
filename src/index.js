import { uniq, has } from 'lodash';
import { readFileSync } from 'fs';

const beforeView = (key, value) => `  - ${key}: ${value}`;
const afterView = (key, value) => `  + ${key}: ${value}`;
const unchgView = (key, value) => `    ${key}: ${value}`;

const diffCalc = k => (b, a) => {
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

const plainJson = (before, after) => {
  const beforeData = readFileSync(before, 'utf-8');
  const afterData = readFileSync(after, 'utf-8');
  const beforeObject = JSON.parse(beforeData);
  const afterObject = JSON.parse(afterData);
  const mapper = uniq(Object.keys(beforeObject).concat(Object.keys(afterObject)))
    .map(k => diffCalc(k));
  return ['{', ...mapper.map(fn => fn(beforeObject, afterObject)), '}'].join('\n');
};
export default plainJson;
