import numeral from 'numeral';

import { ActivityData } from '../../../lib/parser';
import { priceHistoryUrl } from '../../../lib/yahoo-finance';

import { VerificationCell } from './VerificationCell';

export const BreakdownTable = ({ activityData }: { activityData: ActivityData }): JSX.Element => {
  const transactionRows = activityData.transactions.map((transaction) => {
    const shares = numeral(transaction.shares).format('0,0.000');
    const price = numeral(transaction.price).format('$0,0.00');
    const amount = numeral(transaction.amount).format('$0,0.00');

    return (
      <tr
        className={
          transaction.hasWrongShares || transaction.hasWrongPrice ? 'table-danger' : undefined
        }
        // need a unique identifier!
      >
        <td>{transaction.fund}</td>
        <td>{transaction.symbol}</td>
        <td className="text-right">{shares}</td>
        <td className="text-right">
          {!transaction.symbol && price}
          {transaction.symbol && (
            <a href={priceHistoryUrl(transaction.symbol, activityData.date)} target="_blank">
              {price}
            </a>
          )}
        </td>
        <td className="text-right">{amount}</td>
        <td>
          <VerificationCell
            transaction={transaction}
            shares={shares}
            price={price}
            amount={amount}
            date={activityData.date}
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
            <th className="text-right">Shares</th>
            <th className="text-right">Price</th>
            <th className="text-right">Amount</th>
            <th>Verification</th>
          </tr>
        </thead>
        <tbody>{transactionRows}</tbody>
      </table>
    </div>
  );
};
