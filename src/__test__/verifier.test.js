import {checkShares, checkPrices} from '../verifier.js';

test('checkShares marks error if diff above threshold', () => {
  const transactions = [{shares: 100.004, price: 1, amount: 100}];
  checkShares(transactions);
  expect(transactions[0].hasWrongShares).toBe(true);
});

test('checkShares marks error if diff above threshold in other direction', () => {
  const transactions = [{shares: 99.996, price: 1, amount: 100}];
  checkShares(transactions);
  expect(transactions[0].hasWrongShares).toBe(true);
});

test('checkShares does not mark error if diff below threshold', () => {
  const transactions = [{shares: 100.002, price: 1, amount: 100}];
  checkShares(transactions);
  expect(transactions[0].hasWrongShares).toBe(false);
});

test('checkPrices returns false if date not found', () => {
  const transactions = [{symbol: 'VTSAX', price: 99.93}];
  const prices = {'1970-01-01': {'VTSAX': 99.93}};
  const dateTuple = [1970, 1, 2];
  const pricesWereFound = checkPrices(transactions, prices, dateTuple);
  expect(pricesWereFound).toBe(false);
});

test('checkPrices returns false if price for a fund not found', () => {
  const transactions = [{symbol: 'OTHER', price: 99.93}];
  const prices = {'1970-01-01': {'VTSAX': 99.93}};
  const dateTuple = [1970, 1, 1];
  const pricesWereFound = checkPrices(transactions, prices, dateTuple);
  expect(pricesWereFound).toBe(false);
});

test('checkPrices marks error if price is incorrect', () => {
  const transactions = [{symbol: 'VTSAX', price: 99.93}];
  const prices = {'1970-01-01': {'VTSAX': 99.92}};
  const dateTuple = [1970, 1, 1];
  const pricesWereFound = checkPrices(transactions, prices, dateTuple);
  expect(pricesWereFound).toBe(true);
  expect(transactions[0].hasWrongPrice).toBe(true);
});

test('checkPrices does not mark error if price is correct', () => {
  const transactions = [{symbol: 'VTSAX', price: 99.93}];
  const prices = {'1970-01-01': {'VTSAX': 99.93}};
  const dateTuple = [1970, 1, 1];
  const pricesWereFound = checkPrices(transactions, prices, dateTuple);
  expect(pricesWereFound).toBe(true);
  expect(transactions[0].hasWrongPrice).toBe(false);
});
