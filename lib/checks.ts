import { format } from 'date-fns';

import { BasicDate, Transaction } from './parser';

interface Prices {
  [date: string]: {
    [tickerSymbol: string]: number;
  };
}

/**
 * Check: for each fund reinvested, Shares × Price = Amount
 */
export function checkShares(transactions: Transaction[]) {
  const THRESHOLD = 0.003;
  for (const transaction of transactions) {
    const diff = Math.abs(transaction.amount / transaction.price - transaction.shares);
    transaction.hasWrongShares = diff > THRESHOLD;
  }
}

/**
 * Check: for each fund reinvested, price is correct (i.e., matches historical data from Yahoo!
 * Finance)
 * @return whether or not all prices were found for this date
 */
export function checkPrices(transactions: Transaction[], prices: Prices, date: BasicDate): boolean {
  // key for PRICES hash is in yyyy-mm-dd format
  const formattedDate = format(new Date(date.year, date.month - 1, date.day), 'yyyy-MM-dd');
  const pricesForDate = prices[formattedDate];
  if (!pricesForDate) return false;

  for (const transaction of transactions) {
    // Ignore "transactions" with no ticker symbol. Those are the lines like
    // "FDIC Insured Deposit Account"
    if (!transaction.symbol) {
      continue;
    }

    const correctPrice = pricesForDate[transaction.symbol];
    if (!correctPrice) return false;
    transaction.hasWrongPrice = correctPrice !== transaction.price;
    if (transaction.hasWrongPrice) transaction.correctPrice = correctPrice;
  }
  return true;
}
