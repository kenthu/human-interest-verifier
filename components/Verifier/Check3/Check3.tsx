import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import styles from './Check3.module.css';

export const Check3 = (): JSX.Element => {
  return (
    <>
      <h3 className={styles.header}>
        Check #3: Were funds reinvested according to your selected allocation?
      </h3>
      <p>
        <span className={`badge bg-warning text-dark ${styles.badge}`}>
          <FontAwesomeIcon icon={faTriangleExclamation} /> MANUAL STEPS REQUIRED
        </span>
        <br />
        The <a href="#allocation">Actual Allocation table</a> below shows how Human Interest
        allocated your balance into various funds during the migration. Check that it matches the
        allocation you requested.
      </p>
    </>
  );
};
