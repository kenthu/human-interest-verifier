import { config } from '@fortawesome/fontawesome-svg-core';
import type { AppProps } from 'next/app';
import { useEffect, useState } from 'react';

import { ActivityData } from '../types/types';

import 'bootstrap/dist/css/bootstrap.css';
import '@fortawesome/fontawesome-svg-core/styles.css';
import '../styles/globals.css';

config.autoAddCss = false;

export default function App({ Component, pageProps }: AppProps) {
  // https://blog.logrocket.com/handling-bootstrap-integration-next-js/
  useEffect(() => {
    require('bootstrap/dist/js/bootstrap.bundle.min.js');
  }, []);

  const [activityData, setActivityData] = useState<ActivityData | null>(null);

  return <Component {...pageProps} activityData={activityData} setActivityData={setActivityData} />;
}
