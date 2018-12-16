import { readFileSync } from 'fs';
import { has } from 'lodash';
import path from 'path';
import parse from './parsers';
import getDiff from './diff-ast';
import prettyRender from './pretty-renderer';
import plainRender from './plain-renderer';

const getFileType = filePath => path.extname(filePath).toLowerCase().slice(1);
const getRawData = filePath => readFileSync(filePath, 'utf-8');

export const defaultRenderer = 'pretty';

export const renderSelector = {
  [defaultRenderer]: prettyRender,
  plain: plainRender,
};


const render = (data, outputFormat) => (has(renderSelector, outputFormat)
  ? renderSelector[outputFormat](data) : renderSelector[defaultRenderer](data));

const diff = (before, after, format) => {
  const beforeType = getFileType(before);
  const afterType = getFileType(after);
  const beforeRawData = getRawData(before);
  const afterRawData = getRawData(after);
  const beforeObject = parse(beforeRawData, beforeType);
  const afterObject = parse(afterRawData, afterType);
  const difference = getDiff(beforeObject, afterObject);
  return render(difference, format);
};
export default diff;
