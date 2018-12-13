import { readFileSync } from 'fs';
import iniDiff from '../src';

test('.ini files test', () => {
  const before = '__tests__/__fixtures__/before.ini';
  const after = '__tests__/__fixtures__/after.ini';
  const data = readFileSync('__tests__/__fixtures__/b-a-diff.txt', 'utf-8');
  expect(iniDiff(before, after)).toBe(data);
});
