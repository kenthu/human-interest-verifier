import { priceHistoryUrl } from './yahoo-finance';

test('priceHistoryUrl returns correct url', () => {
  expect(priceHistoryUrl('VTSAX', { year: 2023, month: 6, day: 7 })).toBe(
    'https://finance.yahoo.com/quote/VTSAX/history?period1=1685923200&period2=1686355200',
  );
});
