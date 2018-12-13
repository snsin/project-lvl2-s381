import { readFileSync } from 'fs';
import path from 'path';
import { has } from 'lodash';
import yamlParser from 'js-yaml';
import iniParser from 'ini';

const selector = {
  ini: iniParser.decode,
  yaml: yamlParser.safeLoad,
  yml: yamlParser.safeLoad,
  json: JSON.parse,
  default: JSON.parse,
};
const parse = (filePath) => {
  const type = path.extname(filePath).toLowerCase().slice(1);
  const parser = (has(selector, type)) ? selector[type] : selector.default;
  const data = readFileSync(filePath, 'utf-8');
  return parser(data);
};

export default parse;
