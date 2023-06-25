import format from 'date-fns/format';

import { CheckedTransaction, Transaction } from '../types/types';

import { BasicDate, getDate } from './dates';

interface Prices {
  [date: string]: {
    [tickerSymbol: string]: number;
  };
}

export const checkTransactions = (
  transactions: Transaction[],
  historicalPrices: Prices,
  date: BasicDate,
): CheckedTransaction[] => {
  const SHARE_DIFF_THRESHOLD = 0.003;

  // key for historicalPrices hash is in yyyy-mm-dd format
  const formattedDate = format(getDate(date), 'yyyy-MM-dd');
  const pricesForDate = historicalPrices[formattedDate];

  return transactions.map((transaction) => {
    const differenceInShares = Math.abs(
      transaction.amount / transaction.price - transaction.shares,
    );

    let correctPrice: number | null;
    let hasWrongPrice: boolean | null;

    if (pricesForDate && transaction.symbol && transaction.symbol in pricesForDate) {
      correctPrice = pricesForDate[transaction.symbol];
      hasWrongPrice = correctPrice !== transaction.price;
    } else {
      correctPrice = null;
      hasWrongPrice = null;
    }

    return {
      ...transaction,
      hasWrongShares: differenceInShares > SHARE_DIFF_THRESHOLD,
      correctPrice,
      hasWrongPrice,
    };
  });
};
