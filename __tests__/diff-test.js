import path from 'path';
import { readFileSync } from 'fs';
import diff from '../src';

const getDiffTest = (before, after, expected) => {
  const fixtureDir = '__tests__/__fixtures__';
  const beforePath = path.join(fixtureDir, before);
  const afterPath = path.join(fixtureDir, after);
  const expectedData = readFileSync(path.join(fixtureDir, expected), 'utf-8');
  return () => expect(diff(beforePath, afterPath)).toBe(expectedData);
};

['.json', '.yaml', '.ini'].forEach(ext => test(`plain format with ${ext}`, () => {
  const fixtureDir = '__tests__/__fixtures__';
  const beforePath = path.join(fixtureDir, `nested-before${ext}`);
  const afterPath = path.join(fixtureDir, `nested-after${ext}`);
  const expectedData = readFileSync(path.join(fixtureDir, 'nested-b-a-diff-plain.txt'), 'utf-8');
  expect(diff(beforePath, afterPath, 'plain')).toBe(expectedData);
}));

test('plain json', getDiffTest('before.json', 'after.json', 'b-a-diff.txt'));

test('plain yaml', getDiffTest('before.yaml', 'after.YML', 'b-a-diff.txt'));

test('".confrc"-like config', getDiffTest('.beforerc', 'after.json', 'b-a-diff.txt'));

test('mixed .json and .yaml configs',
  getDiffTest('before.json', 'after.YML', 'b-a-diff.txt'));

test('.ini configs', getDiffTest('before.ini', 'after.ini', 'b-a-diff.txt'));

test('nested .json',
  getDiffTest('nested-before.json', 'nested-after.json', 'nested-b-a-diff.txt'));

test('nested .yaml',
  getDiffTest('nested-before.yaml', 'nested-after.yaml', 'nested-b-a-diff.txt'));

test('nested .ini',
  getDiffTest('nested-before.ini', 'nested-after.ini', 'nested-b-a-diff.txt'));
