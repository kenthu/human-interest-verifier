import Head from 'next/head';

import Header from '../../components/Header';
import { AllocationTable } from '../../components/Verifier/AllocationTable/AllocationTable';
import { BreakdownTable } from '../../components/Verifier/BreakdownTable/BreakdownTable';
import { Check1 } from '../../components/Verifier/Check1/Check1';
import { Check2 } from '../../components/Verifier/Check2/Check2';
import { Check3 } from '../../components/Verifier/Check3/Check3';
import { Check4 } from '../../components/Verifier/Check4/Check4';
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
          <Check1 transactions={transactions} />
          <Check2
            pricesWereFound={pricesWereFound}
            transactions={transactions}
            date={activityData.date}
          />
          <Check3 />
          <Check4 totalAmount={totalAmount} />
        </div>
        <BreakdownTable activityData={activityData} />
        <AllocationTable transactions={activityData.transactions} totalAmount={totalAmount} />
      </div>
    </>
  );
}
