import {
  faCircleCheck,
  faCircleXmark,
  faTriangleExclamation,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { format } from 'date-fns';

import { BasicDate, getDate } from '../../../lib/dates';
import { Transaction } from '../../../lib/parser';

import styles from './Check2.module.css';

interface Check2Props {
  pricesWereFound: boolean;
  transactions: Transaction[];
  date: BasicDate;
}

export const Check2 = ({ pricesWereFound, transactions, date }: Check2Props): JSX.Element => {
  const allPricesCorrect = transactions.every((transaction) => !transaction.hasWrongPrice);
  const prettyDate = format(getDate(date), 'MMM dd, yyyy');

  return (
    <>
      <h3 className={styles.header}>
        Check #2: Were reinvested funds purchased at the correct price?
      </h3>
      {pricesWereFound && allPricesCorrect && (
        <p>
          <span className={`badge bg-success ${styles.badge}`}>
            <FontAwesomeIcon icon={faCircleCheck} /> PASS
          </span>
          <br />
          All reinvested funds were purchased at the correct price.
        </p>
      )}
      {pricesWereFound && !allPricesCorrect && (
        <p className={styles.discrepancy}>
          <span className={`badge bg-danger ${styles.badge}`}>
            <FontAwesomeIcon icon={faCircleXmark} /> DISCREPANCY
          </span>
          <br />
          Your shares were bought at the incorrect price for one or more transactions.
        </p>
      )}
      {pricesWereFound && (
        <p>
          See <a href="#breakdown">Transaction Breakdown</a> below for more details.
        </p>
      )}
      {/* Could not find historical prices for one or more funds, so fall back to asking user to do
      manual check */}
      {!pricesWereFound && (
        <p>
          <span className={`badge bg-warning text-dark ${styles.badge}`}>
            <FontAwesomeIcon icon={faTriangleExclamation} /> MANUAL STEPS REQUIRED
          </span>
          <br />
          For each fund in the <a href="#breakdown">Transaction Breakdown</a> below, click the{' '}
          <strong>Price</strong> to open a new tab with actual historical prices for that fund. Find
          the <strong>Close</strong> price for{' '}
          <strong>
            <span>{prettyDate}</span>{' '}
          </strong>{' '}
          in the new tab, then verify that it matches the price you clicked on.
        </p>
      )}
    </>
  );
};
