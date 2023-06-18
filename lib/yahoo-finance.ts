import { BasicDate, getUnixTimestamp } from './dates';

/**
 * Return link to price history for this fund at Yahoo! Finance
 */
export const priceHistoryUrl = (symbol: string, date: BasicDate): string => {
  const unixTimestamp = getUnixTimestamp(date);
  const startDate = unixTimestamp - 86400 * 2;
  const endDate = unixTimestamp + 86400 * 3;
  return `https://finance.yahoo.com/quote/${symbol}/history?period1=${startDate}&period2=${endDate}`;
};
