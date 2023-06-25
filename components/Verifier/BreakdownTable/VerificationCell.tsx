import { faCircleCheck, faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import format from 'date-fns/format';
import numeral from 'numeral';

import { BasicDate, getDate } from '../../../lib/dates';
import { priceHistoryUrl } from '../../../lib/yahoo-finance';
import { Transaction } from '../../../types/types';

import styles from './VerificationCell.module.css';

interface Props {
  transaction: Transaction;
  shares: string;
  price: string;
  amount: string;
  date: BasicDate;
}

/**
 * Show pass/error icon and message
 */
export const VerificationCell = ({
  transaction,
  shares,
  price,
  amount,
  date,
}: Props): JSX.Element | null => {
  if (!transaction.hasWrongShares && !transaction.hasWrongPrice) {
    return (
      <div>
        <FontAwesomeIcon icon={faCircleCheck} className={styles['pass-icon']} /> Pass
      </div>
    );
  }

  if (transaction.hasWrongShares) {
    const expectedShares = numeral(transaction.amount / transaction.price).format('0,0.000');
    return (
      <div>
        <FontAwesomeIcon icon={faCircleXmark} className={styles['fail-icon']} /> You should have
        received {expectedShares} shares, not {shares}
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
      <div>
        <FontAwesomeIcon icon={faCircleXmark} className={styles['fail-icon']} /> The price on{' '}
        {prettyDate} was actually {correctPrice}, not {price}
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
