import Head from 'next/head'

import styles from '../styles/Home.module.css'

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Human Interest 401(k) Verifier</title>
        <script src="https://kit.fontawesome.com/ad67916d83.js" crossorigin="anonymous"></script>
      </Head>

      <div className="container">
        <header className="d-flex flex-wrap justify-content-center py-3 mb-4 border-bottom">
          <a href="./" className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-dark text-decoration-none">
            <span className="fs-4">Human Interest 401(k) Verifier</span>
          </a>
          <ul className="nav nav-pills">
            <li className="nav-item"><a href="javascript:void(0)" className="nav-link active" aria-current="page">Home</a></li>
            <li className="nav-item"><a href="verifier.html" className="nav-link">Verifier</a></li>
          </ul>
        </header>
      </div>
      
      <main>
        <div className="container-md">
          <div className="px-4 my-5 text-center">
            <h1 className="display-5 fw-bold">Human Interest 401(k) Verifier</h1>
            <div className="col-lg-6 mx-auto">
              <p className="lead">This tool performs basic verification on how Human&nbsp;Interest
              reinvests your 401(k) funds after your company migrates from another 401(k) provider</p>
              <div className="d-grid gap-2 d-sm-flex justify-content-sm-center">
                <a href="verifier.html" role="button" className="btn btn-primary btn-lg px-4 gap-3">Get started</a>
              </div>
            </div>
          </div>
          <div className="container px-4 my-4" id="verification-list">
            <h2 className="pb-2 border-bottom">Supported Checks</h2>
            <div className="row row-cols-1 row-cols-lg-4">
              <div className="col pt-3">
                <div className="feature-icon bg-primary bg-gradient"><i className="fas fa-hashtag"></i></div>
                <h3>Shares</h3>
                <div>Were shares calculated correctly for each fund reinvested?<br />(Shares × Price = Amount)</div>
              </div>
              <div className="col pt-3">
                <div className="feature-icon bg-primary bg-gradient"><i className="fas fa-dollar-sign"></i></div>
                <h3>Price</h3>
                <div>Were reinvested funds purchased at the correct price?</div>
              </div>
              <div className="col pt-3">
                <div className="feature-icon bg-primary bg-gradient"><i className="fas fa-chart-pie"></i></div>
                <h3>Allocation</h3>
                <div>Were funds reinvested according to your selected allocation?</div>
              </div>
              <div className="col pt-3">
                <div className="feature-icon bg-primary bg-gradient"><i className="fas fa-piggy-bank"></i></div>
                <h3>Transfer</h3>
                <div>Were all funds from previous 401(k) reinvested?</div>
              </div>
            </div>
          </div>
          <div className="px-4 my-4">
            <h2 className="pb-2 border-bottom">Sample Results</h2>
            <div className="mt-3">
              <a id="sample-link" href="#sample-modal" data-bs-toggle="modal">
                <img src="images/sample_results_thumb.png" className="img-thumbnail" width="222" />
              </a>
            </div>
          </div>
          <div className="modal fade" id="sample-modal" tabindex="-1" aria-labelledby="sample-modal-label" aria-hidden="true" style={{display: 'none'}}>
            <div className="modal-dialog modal-dialog-centered modal-xl">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="sample-modal-label">Sample results</h5>
                  <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div className="modal-body">
                  <img src="images/sample_results.png" className="img-fluid" alt="sample results" />
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
        </div>
      </main>
    </div>
  );
}
