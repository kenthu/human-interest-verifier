import { checkTransactions } from './checks';

// Values that we need to pass in as arguments, but which aren't important for our test
const ignoredPrices = {};
const ignoredDate = { year: 1970, month: 1, day: 1 };

test('checkTransactions flags if discrepancy in shares above threshold', () => {
  const transactions = [{ fund: 'foo', symbol: 'VTSAX', shares: 100.004, price: 1, amount: 100 }];
  const checkedTransactions = checkTransactions(transactions, ignoredPrices, ignoredDate);
  expect(checkedTransactions[0].hasWrongShares).toBe(true);
});

test('checkTransactions flags if discrepancy in shares above threshold in other direction', () => {
  const transactions = [{ fund: 'foo', symbol: 'VTSAX', shares: 99.996, price: 1, amount: 100 }];
  const checkedTransactions = checkTransactions(transactions, ignoredPrices, ignoredDate);
  expect(checkedTransactions[0].hasWrongShares).toBe(true);
});

test('checkTransactions does not flag if discrepancy in shares below threshold', () => {
  const transactions = [{ fund: 'foo', symbol: 'VTSAX', shares: 100.002, price: 1, amount: 100 }];
  const checkedTransactions = checkTransactions(transactions, ignoredPrices, ignoredDate);
  expect(checkedTransactions[0].hasWrongShares).toBe(false);
});

test('checkTransactions returns null correctPrice and hasWrongPrice if date not found', () => {
  const transactions = [{ fund: 'foo', symbol: 'VTSAX', shares: 0, price: 99.93, amount: 3 }];
  const prices = { '1970-01-01': { VTSAX: 99.93 } };
  const date = { year: 1970, month: 1, day: 2 };
  const checkedTransactions = checkTransactions(transactions, prices, date);
  expect(checkedTransactions[0].correctPrice).toBe(null);
  expect(checkedTransactions[0].hasWrongPrice).toBe(null);
});

test('checkTransactions returns null correctPrice and hasWrongPrice if price for a fund not found', () => {
  const transactions = [{ fund: 'foo', symbol: 'OTHER', shares: 0, price: 99.93, amount: 3 }];
  const prices = { '1970-01-01': { VTSAX: 99.93 } };
  const date = { year: 1970, month: 1, day: 1 };
  const checkedTransactions = checkTransactions(transactions, prices, date);
  expect(checkedTransactions[0].correctPrice).toBe(null);
  expect(checkedTransactions[0].hasWrongPrice).toBe(null);
});

test('checkTransactions flags if price is incorrect', () => {
  const transactions = [{ fund: 'foo', symbol: 'VTSAX', shares: 0, price: 99.93, amount: 3 }];
  const prices = { '1970-01-01': { VTSAX: 99.92 } };
  const date = { year: 1970, month: 1, day: 1 };
  const checkedTransactions = checkTransactions(transactions, prices, date);
  expect(checkedTransactions[0].correctPrice).toBe(99.92);
  expect(checkedTransactions[0].hasWrongPrice).toBe(true);
});

test('checkTransactions does not flag if price is correct', () => {
  const transactions = [{ fund: 'foo', symbol: 'VTSAX', shares: 0, price: 99.92, amount: 3 }];
  const prices = { '1970-01-01': { VTSAX: 99.92 } };
  const date = { year: 1970, month: 1, day: 1 };
  const checkedTransactions = checkTransactions(transactions, prices, date);
  expect(checkedTransactions[0].correctPrice).toBe(99.92);
  expect(checkedTransactions[0].hasWrongPrice).toBe(false);
});
