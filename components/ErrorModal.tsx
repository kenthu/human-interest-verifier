import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import bootstrap from 'bootstrap';
import { useEffect, useState } from 'react';

import styles from './ErrorModal.module.css';

interface Props {
  /** Set to true to show the modal ONCE */
  triggerShow: boolean;
  /** Provide a function to set triggerShow */
  setTriggerShow: (value: boolean) => void;
  /** Text to display in modal */
  text: string;
}

// Bootstrap modal: https://getbootstrap.com/docs/5.2/components/modal/
export default function ErrorModal({ triggerShow, setTriggerShow, text }: Props) {
  const MODAL_ID = 'error-modal';
  const LABEL_ID = 'error-modal-label';

  const [modal, setModal] = useState<bootstrap.Modal | null>(null);
  // Initialize modal
  useEffect(() => {
    // https://blog.logrocket.com/handling-bootstrap-integration-next-js/
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { Modal } = require('bootstrap');
    setModal(new Modal(`#${MODAL_ID}`, {}));
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
      id={MODAL_ID}
      tabIndex={-1}
      aria-labelledby={LABEL_ID}
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className={`modal-header ${styles['modal-header']}`}>
            <h5 className="modal-title" id={LABEL_ID}>
              <span className={`badge bg-danger ${styles['modal-title']}`}>
                <FontAwesomeIcon icon={faCircleXmark} /> ERROR
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
