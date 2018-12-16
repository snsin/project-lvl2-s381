import { flatten, has } from 'lodash';

const objRender = (val) => {
  if (val instanceof Object) {
    return ['{', Object.keys(val).map(k => `    ${k}: ${objRender(val[k])}`), '  }'];
  }
  return [val];
};

const rendererSelector = {
  changed: (node) => {
    const { oldValue, newValue, key } = node;
    // const { oldValue, newValue } = value;
    const [newValStr, ...newRest] = objRender(newValue);
    const [oldValStr, ...oldRest] = objRender(oldValue);
    return flatten([`- ${key}: ${oldValStr}`, oldRest,
      `+ ${key}: ${newValStr}`, newRest]);
  },
  added: (node) => {
    const { value, key } = node;
    const [valStr, ...rest] = objRender(value);
    return flatten([`+ ${key}: ${valStr}`, rest]);
  },
  deleted: (node) => {
    const { value, key } = node;
    const [valStr, ...rest] = objRender(value);
    return flatten([`- ${key}: ${valStr}`, rest]);
  },
  unchanged: (node) => {
    const { value, key } = node;
    const [valStr, ...rest] = objRender(value);
    return flatten([`  ${key}: ${valStr}`, rest]);
  },
  nested: (node, fn) => {
    const { children, key } = node;
    const [valStr, ...rest] = ['{', fn(children), '  }'];
    return flatten([`  ${key}: ${valStr}`, rest]);
  },
};

const getRenderer = (type) => {
  if (!has(rendererSelector, type)) {
    throw new Error('Unexpected node type');
  }
  return rendererSelector[type];
};

const renderTree = (tree) => {
  const views = tree.map((node) => {
    const { type } = node;
    return getRenderer(type)(node, renderTree);
  });
  return views;
};

const makeIindentation = (views, level) => {
  const indent = '  '.repeat(level);
  const indentedViews = views.map(item => ((item instanceof Array)
    ? makeIindentation(item, level + 1) : `${indent}${item}`));
  return flatten(indentedViews);
};

export default (tree) => {
  const treeView = renderTree(tree);
  return ['{', ...makeIindentation(treeView, 0), '}'].join('\n');
};
