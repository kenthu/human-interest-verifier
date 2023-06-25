import numeral from 'numeral';

import { Transaction } from '../../../types/types';

import styles from './AllocationTable.module.css';

interface Props {
  transactions: Transaction[];
  totalAmount: number;
}

export const AllocationTable = ({ transactions, totalAmount }: Props): JSX.Element => {
  const allocations: Record<string, { symbol: string; amount: number }> = {};

  // Aggregate by fund
  for (const transaction of transactions) {
    if (!transaction.symbol) {
      continue;
    }
    if (transaction.fund in allocations) {
      allocations[transaction.fund].amount += transaction.amount;
    } else {
      allocations[transaction.fund] = { symbol: transaction.symbol, amount: transaction.amount };
    }
  }

  // Append one row for each fund
  const rows = Object.entries(allocations).map(([fund, allocation]) => {
    const amountPctg = numeral(allocation.amount / totalAmount).format('0.00%');

    return (
      <tr key={fund}>
        <td>{fund}</td>
        <td>{allocation.symbol}</td>
        <td className={styles['text-right']}>{amountPctg}</td>
      </tr>
    );
  });

  return (
    <div className="px-4 my-5 col-lg-8">
      <h2 id="allocation">Actual Allocation</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Fund</th>
            <th>Symbol</th>
            <th className={styles['text-right']}>
              Amount
              <br />
              Allocated
            </th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    </div>
  );
};
