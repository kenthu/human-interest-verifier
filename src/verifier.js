import * as Sentry from '@sentry/browser';
import { Integrations } from '@sentry/tracing';

Sentry.init({
  dsn: 'https://075ffd56f010481db91c9fb856ef73f0@o1029288.ingest.sentry.io/5996228',
  integrations: [new Integrations.BrowserTracing()],
  tracesSampleRate: 1.0,
});

import { format } from 'date-fns';

import 'bootstrap/dist/css/bootstrap.min.css';
import './verifier.css';

/**
 * Show verification results for check 4
 * @param {number} totalAmount - total amount reinvested
 */
function check4Show(totalAmount) {
  document.getElementById('total-amount').innerText = numeral(totalAmount).format('$0,0.00');
}
