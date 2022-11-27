import Head from 'next/head';
import { useEffect, useState } from 'react';

import ErrorModal from '../components/ErrorModal';
import Header from '../components/Header';
import VerifierInstructions from '../components/VerifierInstructions';
import VerifierOverview from '../components/VerifierOverview';
import { parseActivity } from '../lib/parser';

export default function Verifier() {
  const [triggerShow, setTriggerShow] = useState(false);
  const [errorModalText, setErrorModalText] = useState('');

  const showErrorModal = (errorMessage: string): void => {
    setErrorModalText(errorMessage);
    setTriggerShow(true);
  };

  useEffect(() => {
    const handlePastedText = (pastedText: string): void => {
      let activityData;
      try {
        activityData = parseActivity(pastedText);
      } catch (error) {
        if (error instanceof Error) {
          showErrorModal(error.message);
        }
        return;
      }
      if (!activityData) {
        showErrorModal(
          `We were unable to find any transactions in the text you pasted.

            Please reach out to Kent for assistance.`,
        );
        return;
      }
    };

    const handlePasteEvent = (event: Event): void => {
      const pastedText = (event as ClipboardEvent).clipboardData?.getData('text');
      if (pastedText) {
        handlePastedText(pastedText);
      }
      event.preventDefault();
    };

    window.addEventListener('paste', handlePasteEvent);
    return function cleanup() {
      window.removeEventListener('paste', handlePasteEvent);
    };
  }, []);

  return (
    <>
      <Head>
        <title>Human Interest 401(k) Verifier</title>
      </Head>
      <Header />

      <div className="container-md">
        <VerifierOverview />
        <VerifierInstructions />
      </div>

      <ErrorModal triggerShow={triggerShow} setTriggerShow={setTriggerShow} text={errorModalText} />
    </>
  );
}
