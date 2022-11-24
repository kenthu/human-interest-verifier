import { parse } from 'date-fns';

/**
 * Parse activity data copied from History page on Human Interest web site
 * @param {string} pastedActivity - Copied text
 * @return {Object} Object containing information from Plan Conversion transaction set (date and
 * array of transactions). If Plan Conversion transaction set not found, return null;
 */
export function parseActivity(pastedActivity) {
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
        dateTuple: [date.getFullYear(), date.getMonth() + 1, date.getDate()],
        transactions: transactions,
      };
    }
  }

  return null;
}

/**
 * Take a date tuple, and return the UNIX timestamp for midnight of that date in UTC
 * Example: convertDateTupleToUnixTimestamp([2021, 9, 30]) returns the UNIX timestamp for
 * 2021-09-30T00:00:00.000Z
 * @param {number[]} dateTuple - tuple of [year, month, day]
 * @return {number}
 */
export function convertDateTupleToUnixTimestamp(dateTuple) {
  const unixTimestampInMs = Date.UTC(dateTuple[0], dateTuple[1] - 1, dateTuple[2]);
  return Math.floor(unixTimestampInMs / 1000);
}

/**
 * Parse string of transaction text (for a single transaction set) into an array of transaction
 * objects
 * @param {string} transactionText - All the lines for this transaction set
 * @return {Object[]} Transactions
 */
function parseTransactionSet(transactionText) {
  if (transactionText === '') return;

  // If it's a Plan Conversion transaction set, it should have at least one line where the Fund is
  // "FDIC Insured Deposit Account" and the Shares are negative
  if (!transactionText.match(/FDIC Insured Deposit Account.*-\d+\.\d+/i)) return;

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
}

/**
 * Parse pasted line into object representing a transaction
 * Example lines:
 * FDIC Insured Deposit Account        -27163.370  $1.00   -$27,163.37
 * Vanguard Total Stock Market Index Fund Admiral  VTSAX   24.594  $92.62  $2,277.89
 * @param {string} line - Line from pasted text
 * @return {Object} Object representing a single transaction
 */
function parseTransaction(line) {
  const regex =
    /^(?<fund>.+?)\s+(?<symbol>[A-Z]{3,5})?\s*(?<shares>-?\d+\.\d+)\s+\$(?<price>\d+\.\d+)\s+(?<amount>-?\$[\d,]+\.\d+)/;
  const lineMatch = line.match(regex);
  if (!lineMatch) {
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
}
