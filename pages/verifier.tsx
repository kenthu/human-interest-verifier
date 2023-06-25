import Head from 'next/head';
import { useCallback, useEffect, useMemo, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';

import { ErrorModal } from '../components/ErrorModal';
import { Header } from '../components/Header';
import { AllocationTable } from '../components/Verifier/AllocationTable/AllocationTable';
import { BreakdownTable } from '../components/Verifier/BreakdownTable/BreakdownTable';
import { Check1 } from '../components/Verifier/Check1/Check1';
import { Check2 } from '../components/Verifier/Check2/Check2';
import { Check3 } from '../components/Verifier/Check3/Check3';
import { Check4 } from '../components/Verifier/Check4/Check4';
import { VerifierInstructions } from '../components/VerifierInstructions';
import { VerifierOverview } from '../components/VerifierOverview';
import { useHandlePaste } from '../hooks/useHandlePaste';
import { useSavedActivityData } from '../hooks/useSavedActivityData';
import { checkTransactions } from '../lib/checks';
import { parseActivity } from '../lib/parser';
import prices from '../src/prices.json';
import { ActivityData, CheckedTransaction } from '../types/types';

interface Props {
  activityData: ActivityData | null;
  setActivityData: (value: ActivityData | null) => void;
}

export default function Verifier({ activityData, setActivityData }: Props) {
  const [triggerShow, setTriggerShow] = useState(false);
  const [errorModalText, setErrorModalText] = useState('');

  const showErrorModal = (errorMessage: string): void => {
    setErrorModalText(errorMessage);
    setTriggerShow(true);
  };

  const handlePastedText = useCallback(
    (pastedText: string): void => {
      let parsedActivityData;
      try {
        parsedActivityData = parseActivity(pastedText);
      } catch (error) {
        if (error instanceof Error) {
          showErrorModal(error.message);
        }
        return;
      }
      if (!parsedActivityData) {
        showErrorModal(
          `We were unable to find any transactions in the text you pasted.

          Please reach out to Kent for assistance.`,
        );
        return;
      }

      setActivityData(parsedActivityData);
    },
    [setActivityData],
  );

  const { setPasteHandler, unsetPasteHandler } = useHandlePaste(handlePastedText);

  useEffect(() => {
    setPasteHandler();

    return function cleanup() {
      unsetPasteHandler();
    };
  }, [setPasteHandler, unsetPasteHandler]);

  // Don't allow continued pasting if we have valid activity data
  useEffect(() => {
    if (activityData) {
      unsetPasteHandler();
    }
  }, [activityData, unsetPasteHandler]);

  const checkedTransactions = useMemo(
    () =>
      activityData ? checkTransactions(activityData.transactions, prices, activityData.date) : null,
    [activityData],
  );

  const totalAmount = useMemo(
    () =>
      activityData
        ? activityData.transactions.reduce((sum, transaction) => sum + transaction.amount, 0)
        : null,
    [activityData],
  );

  const {
    saveActivityData,
    loadActivityData: loadSavedActivityData,
    resetActivityData: resetSavedActivityData,
  } = useSavedActivityData();

  // Load saved activity data from localStorage
  useEffect(() => {
    // Already in state (e.g., just pasted), no need to load
    if (activityData) {
      return;
    }

    const savedActivityData = loadSavedActivityData();
    if (savedActivityData) {
      setActivityData(savedActivityData);
    }
  }, [activityData, loadSavedActivityData, setActivityData]);

  return (
    <>
      <Head>
        <title>Human Interest 401(k) Verifier</title>
      </Head>
      <Header />

      <div className="container-md">
        {!activityData && (
          <>
            <VerifierOverview />
            <VerifierInstructions />
          </>
        )}
        {activityData && (
          <>
            <div className="px-4 my-5 text-center">
              <h1 className="display-5 fw-bold">Human Interest 401(k) Verifier</h1>
            </div>
            <div className="px-4 my-5 col-lg-10">
              <h2>Verification Results</h2>
              <div className="d-flex">
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={() => {
                    saveActivityData(activityData);
                    toast.success('Results saved to browser', { duration: 3000 });
                  }}
                >
                  Save Results
                </button>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm mx-2"
                  onClick={() => {
                    setActivityData(null);
                    resetSavedActivityData();
                    toast.success('Results cleared from browser', { duration: 3000 });
                  }}
                >
                  Reset
                </button>
              </div>
              <Check1 transactions={checkedTransactions as CheckedTransaction[]} />
              <Check2
                transactions={checkedTransactions as CheckedTransaction[]}
                date={activityData.date}
              />
              <Check3 />
              <Check4 totalAmount={totalAmount as number} />
            </div>
            <BreakdownTable
              transactions={checkedTransactions as CheckedTransaction[]}
              date={activityData.date}
            />
            <AllocationTable
              transactions={checkedTransactions as CheckedTransaction[]}
              totalAmount={totalAmount as number}
            />
          </>
        )}
      </div>

      <Toaster />
      <ErrorModal triggerShow={triggerShow} setTriggerShow={setTriggerShow} text={errorModalText} />
    </>
  );
}
