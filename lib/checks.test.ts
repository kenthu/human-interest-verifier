import { checkShares, checkPrices } from './checks';
import { Transaction } from './parser';

test('checkShares marks error if diff above threshold', () => {
  const transactions: Transaction[] = [
    { fund: 'foo', symbol: 'VTSAX', shares: 100.004, price: 1, amount: 100 },
  ];
  checkShares(transactions);
  expect(transactions[0].hasWrongShares).toBe(true);
});

test('checkShares marks error if diff above threshold in other direction', () => {
  const transactions: Transaction[] = [
    { fund: 'foo', symbol: 'VTSAX', shares: 99.996, price: 1, amount: 100 },
  ];
  checkShares(transactions);
  expect(transactions[0].hasWrongShares).toBe(true);
});

test('checkShares does not mark error if diff below threshold', () => {
  const transactions: Transaction[] = [
    { fund: 'foo', symbol: 'VTSAX', shares: 100.002, price: 1, amount: 100 },
  ];
  checkShares(transactions);
  expect(transactions[0].hasWrongShares).toBe(false);
});

test('checkPrices returns false if date not found', () => {
  const transactions = [{ fund: 'foo', symbol: 'VTSAX', shares: 0, price: 99.93, amount: 3 }];
  const prices = { '1970-01-01': { VTSAX: 99.93 } };
  const pricesWereFound = checkPrices(transactions, prices, { year: 1970, month: 1, day: 2 });
  expect(pricesWereFound).toBe(false);
});

test('checkPrices returns false if price for a fund not found', () => {
  const transactions = [{ fund: 'foo', symbol: 'OTHER', shares: 0, price: 99.93, amount: 3 }];
  const prices = { '1970-01-01': { VTSAX: 99.93 } };
  const pricesWereFound = checkPrices(transactions, prices, { year: 1970, month: 1, day: 1 });
  expect(pricesWereFound).toBe(false);
});

test('checkPrices marks error if price is incorrect', () => {
  const transactions: Transaction[] = [
    { fund: 'foo', symbol: 'VTSAX', shares: 0, price: 99.93, amount: 3 },
  ];
  const prices = { '1970-01-01': { VTSAX: 99.92 } };
  const pricesWereFound = checkPrices(transactions, prices, { year: 1970, month: 1, day: 1 });
  expect(pricesWereFound).toBe(true);
  expect(transactions[0].hasWrongPrice).toBe(true);
});

test('checkPrices does not mark error if price is correct', () => {
  const transactions: Transaction[] = [
    { fund: 'foo', symbol: 'VTSAX', shares: 0, price: 99.93, amount: 3 },
  ];
  const prices = { '1970-01-01': { VTSAX: 99.93 } };
  const pricesWereFound = checkPrices(transactions, prices, { year: 1970, month: 1, day: 1 });
  expect(pricesWereFound).toBe(true);
  expect(transactions[0].hasWrongPrice).toBe(false);
});
