import { faCircleCheck, faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { Transaction } from '../../../types/types';

import styles from './Check1.module.css';

interface Props {
  transactions: Transaction[];
}

export const Check1 = ({ transactions }: Props): JSX.Element => {
  const hasDiscrepancy = transactions.some((transaction) => transaction.hasWrongShares);

  return (
    <>
      <h3 className={styles.header}>
        Check #1: Were shares calculated correctly for each fund reinvested?
      </h3>
      {hasDiscrepancy ? (
        <>
          <p className={styles.discrepancy}>
            <span className={`badge bg-danger ${styles.badge}`}>
              <FontAwesomeIcon icon={faCircleXmark} /> DISCREPANCY
            </span>
            <br />
            You received the wrong number of shares for one or more transactions.
          </p>
          <p>
            See <a href="#breakdown">Transaction Breakdown</a> below for more details.
          </p>
        </>
      ) : (
        <p>
          <span className={`badge bg-success ${styles.badge}`}>
            <FontAwesomeIcon icon={faCircleCheck} /> PASS
          </span>
          <br />
          You received the correct number of shares for all transactions in the reinvestment.
          (Shares = Amount / Price)
        </p>
      )}
    </>
  );
};
