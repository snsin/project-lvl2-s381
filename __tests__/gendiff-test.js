import fs from 'fs';
import genDiff from '../src';

const before = '__tests__/__fixtures__/before.json';
const after = '__tests__/__fixtures__/after.json';
const data = fs.readFileSync('__tests__/__fixtures__/b-a-diff.txt', 'utf8');
test('simple diff', () => {
  expect(genDiff(before, after)).toBe(data);
});
