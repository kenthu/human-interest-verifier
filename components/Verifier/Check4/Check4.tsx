import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import numeral from 'numeral';

import styles from './Check4.module.css';

interface Props {
  totalAmount: number;
}

export const Check4 = ({ totalAmount }: Props): JSX.Element => {
  return (
    <>
      <h3 className={styles.header}>Check #4: Were all funds from previous 401(k) reinvested?</h3>
      <p>
        <span className={`badge bg-warning text-dark ${styles.badge}`}>
          <FontAwesomeIcon icon={faTriangleExclamation} /> MANUAL STEPS REQUIRED
        </span>
        <br />
        Human Interest reinvested{' '}
        <strong>
          <span>{numeral(totalAmount).format('$0,0.00')}</span>
        </strong>{' '}
        into your new 401(k) during the migration. Confirm this total amount against your previous
        401(k) provider's final statement.
      </p>
    </>
  );
};
