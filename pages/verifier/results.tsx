import Head from 'next/head';

import Header from '../../components/Header';
import { AllocationTable } from '../../components/Verifier/AllocationTable/AllocationTable';
import { BreakdownTable } from '../../components/Verifier/BreakdownTable/BreakdownTable';
import { checkPrices, checkShares } from '../../lib/checks';
import { ActivityData } from '../../lib/parser';
import prices from '../../src/prices.json';

interface ResultsProps {
  activityData: ActivityData | null;
  setActivityData: (value: ActivityData | null) => void;
}

export default function Results({ activityData }: ResultsProps) {
  if (!activityData) {
    return null;
  }

  const transactions = activityData.transactions;

  checkShares(transactions);
  const pricesWereFound = checkPrices(transactions, prices, activityData.date);

  const totalAmount = transactions.reduce((sum, transaction) => sum + transaction.amount, 0);

  return (
    <>
      <Head>
        <title>Human Interest 401(k) Verifier</title>
      </Head>
      <Header />

      <div className="container-md">
        <pre>{JSON.stringify(activityData, null, 2)}</pre>
      </div>

      <div className="container-md">
        <div className="px-4 my-5 text-center">
          <h1 className="display-5 fw-bold">Human Interest 401(k) Verifier</h1>
        </div>
        <div className="px-4 my-5 col-lg-10">
          <h2>Verification Results</h2>
          <h3>Check #1: Were shares calculated correctly for each fund reinvested?</h3>
          <p id="check1-pass" style={{ display: 'none' }}>
            <span className="badge bg-success">
              <i className="fas fa-check-circle"></i> PASS
            </span>
            <br />
            You received the correct number of shares for all transactions in the reinvestment.
            (Shares = Amount / Price)
          </p>
          <p id="check1-discrepancy" style={{ display: 'none', color: 'red' }}>
            <span className="badge bg-danger">
              <i className="fas fa-times-circle"></i> DISCREPANCY
            </span>
            <br />
            You received the wrong number of shares for one or more transactions.
          </p>
          <p>
            See <a href="#breakdown">Transaction Breakdown</a> below for more details.
          </p>
          <h3>Check #2: Were reinvested funds purchased at the correct price?</h3>
          <p id="check2-pass" style={{ display: 'none' }}>
            <span className="badge bg-success">
              <i className="fas fa-check-circle"></i> PASS
            </span>
            <br />
            All reinvested funds were purchased at the correct price.
          </p>
          <p id="check2-discrepancy" style={{ display: 'none', color: 'red' }}>
            <span className="badge bg-danger">
              <i className="fas fa-times-circle"></i> DISCREPANCY
            </span>
            <br />
            Your shares were bought at the incorrect price for one or more transactions.
          </p>
          <p id="check2-link-to-breakdown" style={{ display: 'none' }}>
            See <a href="#breakdown">Transaction Breakdown</a> below for more details.
          </p>
          <p id="check2-fallback" style={{ display: 'none' }}>
            <span className="badge bg-warning text-dark">
              <i className="fas fa-exclamation-triangle"></i> MANUAL STEPS REQUIRED
            </span>
            <br />
            For each fund in the <a href="#breakdown">Transaction Breakdown</a> below, click the
            <strong>Price</strong> to open a new tab with actual historical prices for that fund.
            Find the <strong>Close</strong> price for
            <strong>
              <span id="transaction-date"></span>{' '}
            </strong>{' '}
            in the new tab, then verify that it matches the price you clicked on.
          </p>
          <h3>Check #3: Were funds reinvested according to your selected allocation?</h3>
          <p>
            <span className="badge bg-warning text-dark">
              <i className="fas fa-exclamation-triangle"></i> MANUAL STEPS REQUIRED
            </span>
            <br />
            The <a href="#allocation">Actual Allocation table</a> below shows how Human Interest
            allocated your balance into various funds during the migration. Check that it matches
            the allocation you requested.
          </p>
          <h3>Check #4: Were all funds from previous 401(k) reinvested?</h3>
          <p>
            <span className="badge bg-warning text-dark">
              <i className="fas fa-exclamation-triangle"></i> MANUAL STEPS REQUIRED
            </span>
            <br />
            Human Interest reinvested{' '}
            <strong>
              <span id="total-amount"></span>
            </strong>{' '}
            into your new 401(k) during the migration. Confirm this total amount against your
            previous 401(k) provider's final statement.
          </p>
        </div>
        <BreakdownTable activityData={activityData} />
        <AllocationTable transactions={activityData.transactions} totalAmount={totalAmount} />
      </div>
    </>
  );
}
