/**
 * Check: for each fund reinvested, Shares × Price = Amount
 * @param {Object[]} transactions - Array of transaction objects
 */
export function checkShares(transactions) {
  const THRESHOLD = 0.003;
  for (const transaction of transactions) {
    const diff = Math.abs(transaction.amount / transaction.price - transaction.shares);
    transaction.has_wrong_shares = diff > THRESHOLD;
  }
}
