import {checkShares} from '../verifier.js';

test('checkShares marks error if diff above threshold', () => {
  const transactions = [{shares: 100.004, price: 1, amount: 100}];
  checkShares(transactions);
  expect(transactions[0].has_wrong_shares).toBe(true);
});

test('checkShares marks error if diff above threshold in other direction', () => {
  const transactions = [{shares: 99.996, price: 1, amount: 100}];
  checkShares(transactions);
  expect(transactions[0].has_wrong_shares).toBe(true);
});

test('checkShares does not mark error if diff below threshold', () => {
  const transactions = [{shares: 100.002, price: 1, amount: 100}];
  checkShares(transactions);
  expect(transactions[0].has_wrong_shares).toBe(false);
});
