const diffCalc = k => (b, a) => {
  if (b[k] === a[k]) {
    return `  ${k}: ${a[k]}`;
  }
  if (b[k] === undefined) {
    return `+ ${k}: ${a[k]}`;
  }
  if (a[k] === undefined) {
    return `- ${k}: ${b[k]}`;
  }
  return `+ ${k}: ${a[k]}\n- ${k}: ${b[k]}`;
};

const genDiff = (before, after) => {
  const beforeObject = JSON.parse(before);
  const afterObject = JSON.parse(after);
  const selector = Object.keys(beforeObject).concat(Object.keys(afterObject))
    .reduce((acc, k) => ({ ...acc, [k]: diffCalc(k) }), {});
  return `{\n${Object.keys(selector)
    .map(k => selector[k](beforeObject, afterObject)).join('\n')}\n}`;
};
export default genDiff;
