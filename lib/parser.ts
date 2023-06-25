import parse from 'date-fns/parse';

import { ActivityData, Transaction } from '../types/types';

/**
 * Parse activity data copied from History page on Human Interest web site
 * @param pastedActivity - Copied text
 * @return Information from Plan Conversion transaction set (date and array of transactions). If
 * Plan Conversion transaction set not found, return null;
 */
export const parseActivity = (pastedActivity: string): ActivityData | null => {
  // Each regex match represents one set of transactions. Find date at start of line, then grab
  // everything until we find another date (or the "Need help" at the bottom)
  const groupingRegex =
    /(^\d{2}\/\d{2}\/\d{4})\s*\r?\n(.*?)(?=^(\d{2}\/\d{2}\/\d{4}|Need help))/gims;
  const matches = pastedActivity.matchAll(groupingRegex);
  for (const match of matches) {
    const date = parse(match[1], 'MM/dd/yyyy', new Date());
    const transactions = parseTransactionSet(match[2]);
    if (transactions) {
      return {
        date: {
          year: date.getFullYear(),
          month: date.getMonth() + 1,
          day: date.getDate(),
        },
        transactions,
      };
    }
  }

  return null;
};

/**
 * Parse string of transaction text (for a single transaction set) into an array of transaction
 * objects
 * @param transactionText - All the lines for this transaction set
 */
const parseTransactionSet = (transactionText: string): Transaction[] | null => {
  if (transactionText === '') {
    return null;
  }

  // If it's a Plan Conversion transaction set, it should have at least one line where the Fund is
  // "FDIC Insured Deposit Account" and the Shares are negative
  if (!transactionText.match(/FDIC Insured Deposit Account.*-\d+\.\d+/i)) {
    return null;
  }

  const lines = transactionText.split(/\r?\n/);
  let transactions = [];
  // TODO: Move skip regexes into an array
  for (const line of lines) {
    if (line === '') {
      continue;
    } else if (line.match(/Contribution\s*$/i)) {
      // Skip lines indicating "roth Contribution" or "employer Contribution"
      continue;
    } else if (line.match(/^Fund\s+Shares\s+Price\s+Amount\s*$/i)) {
      // Skip table header
      continue;
    } else if (line.match(/^Plan Conversion/i)) {
      // Skip "Plan Conversion" line
      continue;
    } else if (line.match(/^Assets from a previous provider/i)) {
      // Skip "Assets from a previous provider" line
      continue;
    }
    transactions.push(parseTransaction(line));
  }
  transactions = transactions.filter((t) => t.fund !== 'FDIC Insured Deposit Account');

  // Sort by Fund asc, then Amount desc
  transactions.sort((t1, t2) => {
    if (t1.fund < t2.fund) return -1;
    if (t1.fund > t2.fund) return 1;
    if (t1.amount < t2.amount) return 1;
    if (t1.amount > t2.amount) return -1;
    return 0;
  });

  return transactions;
};

/**
 * Parse pasted line into object representing a transaction
 * Example lines:
 * FDIC Insured Deposit Account        -27163.370  $1.00   -$27,163.37
 * Vanguard Total Stock Market Index Fund Admiral  VTSAX   24.594  $92.62  $2,277.89
 * @param line - Line from pasted text
 */
const parseTransaction = (line: string): Transaction => {
  const regex =
    /^(?<fund>.+?)\s+(?<symbol>[A-Z]{3,5})?\s*(?<shares>-?\d+\.\d+)\s+\$(?<price>\d+\.\d+)\s+(?<amount>-?\$[\d,]+\.\d+)/;
  const lineMatch = line.match(regex);
  if (!lineMatch || !lineMatch.groups) {
    throw new Error(
      `We were unable to process the following line you pasted:

      ${line}

      Please reach out to Kent for assistance.`,
    );
  }

  return {
    fund: lineMatch.groups.fund,
    symbol: lineMatch.groups.symbol ? lineMatch.groups.symbol.trim() : null,
    shares: parseFloat(lineMatch.groups.shares),
    price: parseFloat(lineMatch.groups.price),
    amount: parseFloat(lineMatch.groups.amount.replace(/\$/g, '').replace(/,/g, '')),
  };
};
