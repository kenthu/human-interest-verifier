import Head from 'next/head';

import Header from '../components/Header';
import Home from '../components/Home';

export default function Index() {
  return (
    <>
      <Head>
        <title>Human Interest 401(k) Verifier</title>
      </Head>
      <Header />
      <Home />
    </>
  );
}
