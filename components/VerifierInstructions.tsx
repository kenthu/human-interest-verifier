import Image from 'next/image';

import styles from './VerifierInstructions.module.css';

export default function VerifierInstructions() {
  return (
    <div className="px-4 my-4 col-lg-10">
      <h2 className="pb-2 border-bottom">Instructions</h2>
      <ol className={styles['steps']}>
        <li>
          Sign in to{' '}
          <a href="https://humaninterest.com/" target="_blank">
            Human Interest
          </a>
        </li>
        <li>
          Click on <strong>History</strong> in the header, then click on <strong>View More</strong>
          <br />
          <Image
            src="/images/inst_history_view_more.png"
            className="img-fluid"
            alt="History screenshot"
            width="850"
            height="272"
          />
        </li>
        <li>
          Click <strong>Load More</strong> at the bottom of the All Transactions panel.
          <br />
          <Image
            src="/images/inst_load_more.png"
            className="img-fluid"
            alt="Load More screenshot"
            width="850"
            height="250"
          />
        </li>
        <li>
          Keep scrolling and clicking <strong>Load More</strong> until you see a yellow tab labeled{' '}
          <strong>Plan Conversion</strong>, followed by this text:{' '}
          <em>Assets from a previous provider totalling $_____ were reinvested.</em>
        </li>
        <li>
          Click the <strong>V</strong> symbol to expand the Plan Conversion
          <br />
          <Image
            src="/images/inst_v_symbol.png"
            className="img-fluid"
            alt="V Symbol screenshot"
            width="850"
            height="65"
          />
        </li>
        <li>Wait for Plan Conversion section to load</li>
        <li>
          Select all text on the page <em>(Command-A on macOS, Control-A on Windows)</em>
        </li>
        <li>
          Copy selected text to clipboard <em>(Command-C on macOS, Control-C on Windows)</em>
        </li>
        <li>
          Paste copied text to this page <em>(Command-V on macOS, Control-V on Windows)</em>. No
          need to paste into an input field, just paste directly!
        </li>
      </ol>
    </div>
  );
}
