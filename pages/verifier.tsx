import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import ErrorModal from '../components/ErrorModal';
import Header from '../components/Header';
import VerifierInstructions from '../components/VerifierInstructions';
import VerifierOverview from '../components/VerifierOverview';
import { ActivityData, parseActivity } from '../lib/parser';

interface VerifierProps {
  activityData: ActivityData | null;
  setActivityData: (value: ActivityData | null) => void;
}

export default function Verifier({ activityData, setActivityData }: VerifierProps) {
  const [triggerShow, setTriggerShow] = useState(false);
  const [errorModalText, setErrorModalText] = useState('');

  const showErrorModal = (errorMessage: string): void => {
    setErrorModalText(errorMessage);
    setTriggerShow(true);
  };

  const router = useRouter();

  useEffect(() => {
    const handlePastedText = (pastedText: string): void => {
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
      router.push('/verifier/results');
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
