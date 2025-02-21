// src/sum.test.js
import { test, expect } from '@jest/globals';
import { sum } from 'src/sum.js';

test('adds 1 + 2 to equal 3', () => {
  expect(sum(1, 2)).toBe(3);
});