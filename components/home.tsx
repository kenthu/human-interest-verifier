import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChartPie, faDollarSign, faHashtag, faPiggyBank } from '@fortawesome/free-solid-svg-icons'
import '@fortawesome/fontawesome-svg-core/styles.css'

import Image from 'next/image';
import Link from 'next/link';

import styles from './home.module.css'

export default function Home() {
  return (
    <main className="container-md">
      <div className="px-4 my-5 text-center">
        <h1 className="display-5 fw-bold">Human Interest 401(k) Verifier</h1>
        <div className="col-lg-6 mx-auto">
          <p className="lead">This tool performs basic verification on how Human&nbsp;Interest
          reinvests your 401(k) funds after your company migrates from another 401(k) provider</p>
          <div className="d-grid gap-2 d-sm-flex justify-content-sm-center">
            <Link href="/verifier" role="button" className="btn btn-primary btn-lg px-4 gap-3">Get started</Link>
          </div>
        </div>
      </div>

      <div className="container px-4 my-4" id="verification-list">
        <h2 className="pb-2 border-bottom">Supported Checks</h2>
        <div className="row row-cols-1 row-cols-lg-4">
          <div className="col pt-3">
            <div className={`${styles['feature-icon']} bg-primary bg-gradient`}><FontAwesomeIcon icon={faHashtag} /></div>
            <h3>Shares</h3>
            <div>Were shares calculated correctly for each fund reinvested?<br />(Shares × Price = Amount)</div>
          </div>
          <div className="col pt-3">
            <div className={`${styles['feature-icon']} bg-primary bg-gradient`}><FontAwesomeIcon icon={faDollarSign} /></div>
            <h3>Price</h3>
            <div>Were reinvested funds purchased at the correct price?</div>
          </div>
          <div className="col pt-3">
            <div className={`${styles['feature-icon']} bg-primary bg-gradient`}><FontAwesomeIcon icon={faChartPie} /></div>
            <h3>Allocation</h3>
            <div>Were funds reinvested according to your selected allocation?</div>
          </div>
          <div className="col pt-3">
            <div className={`${styles['feature-icon']} bg-primary bg-gradient`}><FontAwesomeIcon icon={faPiggyBank} /></div>
            <h3>Transfer</h3>
            <div>Were all funds from previous 401(k) reinvested?</div>
          </div>
        </div>
      </div>

      <div className="px-4 my-4">
        <h2 className="pb-2 border-bottom">Sample Results</h2>
        <div className="mt-3">
          <a href="#sample-modal" data-bs-toggle="modal" className={styles['sample-link']}>
            <Image src="/images/sample_results_thumb.png" className="img-thumbnail" height="365" width="222" alt="sample results thumbnail" />
          </a>
        </div>
      </div>

      {/* Bootstrap modal: https://getbootstrap.com/docs/5.2/components/modal/ */}
      <div className="modal fade" id="sample-modal" tabIndex={-1} aria-labelledby="sample-modal-label" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered modal-xl">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="sample-modal-label">Sample results</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <Image src="/images/sample_results.png" className="img-fluid" alt="sample results" height="1852" width="1106" />
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 my-4 col-lg-10">
        <h2 className="pb-2 border-bottom">Privacy</h2>
        <p>At each step of development, user privacy has been prioritized. None of your data is
        logged or persisted.</p>
        <p>The source code for this tool is available on <a
        href="https://github.com/kenthu/human-interest-verifier">GitHub</a>.</p>
      </div>
    </main>
  );
}
