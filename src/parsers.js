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
const parse = (data, type = 'json') => {
  const parser = (has(selector, type)) ? selector[type] : selector.default;
  return parser(data);
};

export default parse;
