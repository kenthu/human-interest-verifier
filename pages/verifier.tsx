import Head from 'next/head'
import Header from '../components/Header';
import VerifierOverview from '../components/VerifierOverview';
import VerifierInstructions from '../components/VerifierInstructions';

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
