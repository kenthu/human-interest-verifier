import Head from 'next/head';
import { useEffect } from 'react';

import Header from '../components/Header';
import VerifierInstructions from '../components/VerifierInstructions';
import VerifierOverview from '../components/VerifierOverview';
import { parseActivity } from '../lib/parser';

export default function Verifier() {
  const showErrorModal = (errorMessage: string): void => {
    const errorModalText = document.getElementById('error-modal-text');
    if (errorModalText) {
      errorModalText.innerText = errorMessage;
      // https://blog.logrocket.com/handling-bootstrap-integration-next-js/
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { Modal } = require('bootstrap');
      const modal = new Modal('#error-modal', {});
      modal.show();
    }
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

      <div
        className="modal fade"
        id="error-modal"
        tabIndex={-1}
        aria-labelledby="error-modal-label"
        aria-hidden="true"
        style={{ display: 'none' }}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="error-modal-label">
                <span className="badge bg-danger">
                  <i className="fas fa-times-circle"></i> ERROR
                </span>
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body" id="error-modal-text"></div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
