import {format} from 'date-fns';

/**
 * Check: for each fund reinvested, Shares × Price = Amount
 * @param {Object[]} transactions - Array of transaction objects
 */
export function checkShares(transactions) {
  const THRESHOLD = 0.003;
  for (const transaction of transactions) {
    const diff = Math.abs(transaction.amount / transaction.price - transaction.shares);
    transaction.hasWrongShares = diff > THRESHOLD;
  }
}

/**
 * Check: for each fund reinvested, price is correct (i.e., matches historical data from Yahoo!
 * Finance)
 * @param {Object[]} transactions - Array of transaction objects
 * @param {Object} prices - Object/hash of price data
 * @param {number[]} dateTuple - date of transactions as tuple of [year, month, day]
 * @return {boolean} whether or not all prices were found for this date
 */
export function checkPrices(transactions, prices, dateTuple) {
  // key for PRICES hash is in yyyy-mm-dd format
  const date = format(new Date(dateTuple[0], dateTuple[1] - 1, dateTuple[2]), 'yyyy-MM-dd');
  const pricesForDate = prices[date];
  if (!pricesForDate) return false;

  for (const transaction of transactions) {
    const correctPrice = pricesForDate[transaction.symbol];
    if (!correctPrice) return false;
    transaction.hasWrongPrice = correctPrice !== transaction.price;
    if (transaction.hasWrongPrice) transaction.correctPrice = correctPrice;
  }
  return true;
}
