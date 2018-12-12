import { readFileSync } from 'fs';
import genDiff from '../src';

let data;
beforeAll(() => {
  data = readFileSync('__tests__/__fixtures__/b-a-diff.txt', 'utf-8');
});

test('yaml format test', () => {
  const before = '__tests__/__fixtures__/before.yaml';
  const after = '__tests__/__fixtures__/after.YML';
  expect(genDiff(before, after)).toBe(data);
});

test('".confrc"-like test', () => {
  const before = '__tests__/__fixtures__/.beforerc';
  const after = '__tests__/__fixtures__/after.json';
  expect(genDiff(before, after)).toBe(data);
});

test('mixed .json and .yaml files', () => {
  const before = '__tests__/__fixtures__/before.json';
  const after = '__tests__/__fixtures__/after.YML';
  expect(genDiff(before, after)).toBe(data);
});
