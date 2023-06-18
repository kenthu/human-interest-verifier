import format from 'date-fns/format';
import numeral from 'numeral';

import { BasicDate, getDate } from '../../../lib/dates';
import { Transaction } from '../../../lib/parser';
import { priceHistoryUrl } from '../../../lib/yahoo-finance';

interface VerificationCellProps {
  transaction: Transaction;
  shares: string;
  price: string;
  amount: string;
  date: BasicDate;
}

/**
 * Pass/error icon and message
 */
export const VerificationCell = ({
  transaction,
  shares,
  price,
  amount,
  date,
}: VerificationCellProps): JSX.Element | null => {
  if (!transaction.hasWrongShares && !transaction.hasWrongPrice) {
    return (
      <>
        <i className="fas fa-check-circle"></i> Pass
      </>
    );
  }

  if (transaction.hasWrongShares) {
    const expectedShares = numeral(transaction.amount / transaction.price).format('0,0.000');
    return (
      <div className="issue-description">
        <i className="fas fa-times-circle"></i> You should have received {expectedShares} shares,
        not {shares}
        <br />
        <small>
          {amount} / {price} = {expectedShares}
        </small>
      </div>
    );
  }

  if (transaction.hasWrongPrice) {
    const correctPrice = numeral(transaction.correctPrice).format('$0,0.00');
    const prettyDate = format(getDate(date), 'MMM dd, yyyy');

    return (
      <div className="issue-description">
        <i className="fas fa-times-circle"></i> The price on {prettyDate} was actually{' '}
        {correctPrice}, not {price}
        {transaction.symbol && (
          <>
            <br />
            <small>
              <a href={priceHistoryUrl(transaction.symbol, date)} target="_blank">
                Reference
              </a>
            </small>
          </>
        )}
      </div>
    );
  }

  return null;
};
