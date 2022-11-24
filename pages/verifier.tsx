import Head from 'next/head'

import Header from '../components/Header';
import VerifierInstructions from '../components/VerifierInstructions';
import VerifierOverview from '../components/VerifierOverview';

export default function Verifier() {
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
    </>
  );
}
