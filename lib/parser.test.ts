/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { parseActivity, convertDateTupleToUnixTimestamp } from './parser';

test('parseActivity returns correct date and transactions', () => {
  const validActivityData = `Extra text ...
08/28/2021	
Contribution
You contributed $500.00 and your employer contributed $50.00 for pay date 08/27/2021.
12/18/2020	
12/09/2020	
roth Contribution
Fund	Shares	Price	Amount
FDIC Insured Deposit Account 	-10000.000	$1.00	-$10,000.00
Vanguard Total Stock Market Index Fund Admiral VTSAX	107.968	$92.62	$10,000.00
employer Contribution
Fund	Shares	Price	Amount
FDIC Insured Deposit Account 	-10000.000	$1.00	-$10,000.00
Vanguard Total Stock Market Index Fund Admiral VTSAX	107.968	$92.62	$10,000.00
12/04/2020	
  `;

  const parseOutput = parseActivity(validActivityData);
  expect(parseOutput).toBeTruthy();
  expect(parseOutput!.date).toEqual({ year: 2020, month: 12, day: 9 });
  expect(parseOutput!.transactions).toEqual([
    {
      amount: 10000,
      fund: 'Vanguard Total Stock Market Index Fund Admiral',
      price: 92.62,
      shares: 107.968,
      symbol: 'VTSAX',
    },
    {
      amount: 10000,
      fund: 'Vanguard Total Stock Market Index Fund Admiral',
      price: 92.62,
      shares: 107.968,
      symbol: 'VTSAX',
    },
  ]);
});

test('parseActivity returns null if Plan Conversion transaction set not found', () => {
  const invalidActivityData = `Extra text ...
12/09/2020	
roth Contribution
Fund	Shares	Price	Amount
Vanguard Total Stock Market Index Fund Admiral VTSAX	107.968	$92.62	$10,000.00
employer Contribution
Fund	Shares	Price	Amount
Vanguard Total Stock Market Index Fund Admiral VTSAX	107.968	$92.62	$10,000.00
12/04/2020	
  `;

  expect(parseActivity(invalidActivityData)).toBeNull();
});

test('convertDateTupleToUnixTimestamp returns correct values', () => {
  expect(convertDateTupleToUnixTimestamp({ year: 2020, month: 8, day: 27 })).toBe(1598486400);
  expect(convertDateTupleToUnixTimestamp({ year: 2021, month: 9, day: 3 })).toBe(1630627200);
});
