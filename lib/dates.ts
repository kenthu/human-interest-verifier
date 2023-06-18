export interface BasicDate {
  year: number;
  month: number;
  day: number;
}

export const getDate = (date: BasicDate): Date => {
  return new Date(date.year, date.month - 1, date.day);
};

/**
 * Take a date, and return the UNIX timestamp for midnight of that date in UTC
 * Example: convertDateTupleToUnixTimestamp([2021, 9, 30]) returns the UNIX timestamp for
 * 2021-09-30T00:00:00.000Z
 */
export function getUnixTimestamp(date: BasicDate): number {
  const unixTimestampInMs = Date.UTC(date.year, date.month - 1, date.day);
  return Math.floor(unixTimestampInMs / 1000);
}
