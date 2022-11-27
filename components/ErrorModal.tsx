import bootstrap from 'bootstrap';
import { useEffect, useState } from 'react';

import styles from './ErrorModal.module.css';

interface ErrorModalProps {
  /** Set to true to show the modal ONCE */
  triggerShow: boolean;
  /** Provide a function to set triggerShow */
  setTriggerShow: (value: boolean) => void;
  /** Text to display in modal */
  text: string;
}

// Bootstrap modal: https://getbootstrap.com/docs/5.2/components/modal/
export default function ErrorModal({ triggerShow, setTriggerShow, text }: ErrorModalProps) {
  const modalId = 'error-modal';
  const labelId = 'error-modal-label';

  const [modal, setModal] = useState<bootstrap.Modal | null>(null);
  // Initialize modal
  useEffect(() => {
    // https://blog.logrocket.com/handling-bootstrap-integration-next-js/
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { Modal } = require('bootstrap');
    setModal(new Modal(`#${modalId}`, {}));
  }, []);

  useEffect(() => {
    if (triggerShow && modal) {
      modal.show();

      // Reset trigger
      setTriggerShow(false);
    }
  }, [modal, triggerShow, setTriggerShow]);

  return (
    <div
      className="modal fade"
      id={modalId}
      tabIndex={-1}
      aria-labelledby={labelId}
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id={labelId}>
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
          <div className={`modal-body ${styles['modal-text']}`}>{text}</div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}