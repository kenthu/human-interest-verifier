import Head from 'next/head'
import Header from '../components/header';
import Home from '../components/home';

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
