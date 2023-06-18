import { getDate, getUnixTimestamp } from './dates';

test('getDate returns correct values', () => {
  const basicDate = { year: 2020, month: 8, day: 27 };
  const expectedDate = new Date(2020, 8 - 1, 27);
  expect(getDate(basicDate).getTime()).toBe(expectedDate.getTime());
});

test('getUnixTimestamp returns correct values', () => {
  expect(getUnixTimestamp({ year: 2020, month: 8, day: 27 })).toBe(1598486400);
  expect(getUnixTimestamp({ year: 2021, month: 9, day: 3 })).toBe(1630627200);
});
