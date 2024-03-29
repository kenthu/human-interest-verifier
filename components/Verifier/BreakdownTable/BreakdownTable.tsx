import numeral from 'numeral';

import { BasicDate } from '../../../lib/dates';
import { priceHistoryUrl } from '../../../lib/yahoo-finance';
import { CheckedTransaction } from '../../../types/types';

import styles from './BreakdownTable.module.css';
import { VerificationCell } from './VerificationCell';

interface Props {
  transactions: CheckedTransaction[];
  date: BasicDate;
}

export const BreakdownTable = ({ transactions, date }: Props): JSX.Element => {
  const transactionRows = transactions.map((transaction, i) => {
    const shares = numeral(transaction.shares).format('0,0.000');
    const price = numeral(transaction.price).format('$0,0.00');
    const amount = numeral(transaction.amount).format('$0,0.00');

    return (
      <tr
        // No unique values in transactions, so just use index
        key={i}
        className={
          transaction.hasWrongShares || transaction.hasWrongPrice ? 'table-danger' : undefined
        }
      >
        <td>{transaction.fund}</td>
        <td>{transaction.symbol}</td>
        <td className={styles['text-right']}>{shares}</td>
        <td className={styles['text-right']}>
          {!transaction.symbol && price}
          {transaction.symbol && (
            <a href={priceHistoryUrl(transaction.symbol, date)} target="_blank">
              {price}
            </a>
          )}
        </td>
        <td className={styles['text-right']}>{amount}</td>
        <td>
          <VerificationCell
            transaction={transaction}
            shares={shares}
            price={price}
            amount={amount}
            date={date}
          />
        </td>
      </tr>
    );
  });

  return (
    <div className="px-4 my-5 col-lg-12">
      <h2 id="breakdown">Transaction Breakdown</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Fund</th>
            <th>Symbol</th>
            <th className={styles['text-right']}>Shares</th>
            <th className={styles['text-right']}>Price</th>
            <th className={styles['text-right']}>Amount</th>
            <th>Verification</th>
          </tr>
        </thead>
        <tbody>{transactionRows}</tbody>
      </table>
    </div>
  );
};
