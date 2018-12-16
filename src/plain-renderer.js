import { has, flatten } from 'lodash';

const getParentView = (parent, key) => (parent ? `${parent}.${key}` : `${key}`);
const wrapValue = (val) => {
  if (typeof val === 'string') {
    return `'${val}'`;
  }
  if (val instanceof Object) {
    return '[complex value]';
  }
  return val;
};

const rendererSelector = {
  changed: (node, parent = null) => {
    const { oldValue, newValue, key } = node;
    const wrappedOld = wrapValue(oldValue);
    const wrappedNew = wrapValue(newValue);
    const property = getParentView(parent, key);
    return `Property '${property}' was updated. From ${wrappedOld} to ${wrappedNew}`;
  },
  added: (node, parent = null) => {
    const { value, key } = node;
    const property = getParentView(parent, key);
    const wrappedVal = wrapValue(value);
    return `Property '${property}' was added with value: ${wrappedVal}`;
  },
  deleted: (node, parent = null) => {
    const { key } = node;
    const property = getParentView(parent, key);
    return `Property '${property}' was removed`;
  },
  unchanged: () => '',
  nested: (node, parent, fn) => {
    const { children, key } = node;
    const parentStr = getParentView(parent, key);
    return fn(children, parentStr);
  },
};

const getRenderer = (type) => {
  if (!has(rendererSelector, type)) {
    throw new Error('Unexpected node type');
  }
  return rendererSelector[type];
};

const renderTree = (tree, parent = null) => {
  const views = tree.map((node) => {
    const { type } = node;
    return getRenderer(type)(node, parent, renderTree);
  });
  return flatten(views.filter(v => v));
};

// export default v => v;
export default tree => renderTree(tree).filter(v => v).join('\n');
