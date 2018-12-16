import { readFileSync } from 'fs';
import path from 'path';
import parse from './parsers';
import getDiff from './diff-ast';
import render from './pretty-renderer';

const getFileType = filePath => path.extname(filePath).toLowerCase().slice(1);
const getRawData = filePath => readFileSync(filePath, 'utf-8');

const diff = (before, after) => {
  const beforeType = getFileType(before);
  const afterType = getFileType(after);
  const beforeRawData = getRawData(before);
  const afterRawData = getRawData(after);
  const beforeObject = parse(beforeRawData, beforeType);
  const afterObject = parse(afterRawData, afterType);
  const difference = getDiff(beforeObject, afterObject);
  return render(difference);
};
export default diff;
