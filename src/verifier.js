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
 * Show verification results for check 2
 * @param {boolean} pricesWereFound - whether or not all prices were found for this date
 * @param {Object[]} transactions
 * @param {number[]} dateTuple - date of transactions as tuple of [year, month, day]
 */
function check2Show(pricesWereFound, transactions, dateTuple) {
  if (pricesWereFound) {
    const textToShow = transactions.some((transaction) => transaction.hasWrongPrice)
      ? 'check2-discrepancy'
      : 'check2-pass';
    document.getElementById(textToShow).style.display = '';
    document.getElementById('check2-link-to-breakdown').style.display = '';
  } else {
    // Could not find historical prices for one or more funds, so fall back to asking user to do
    // manual check
    // use getDate insetad
    const prettyDate = format(
      new Date(dateTuple[0], dateTuple[1] - 1, dateTuple[2]),
      'MMM dd, yyyy',
    );
    document.getElementById('transaction-date').innerText = prettyDate;
    document.getElementById('check2-fallback').style.display = '';
  }
}

/**
 * Show verification results for check 4
 * @param {number} totalAmount - total amount reinvested
 */
function check4Show(totalAmount) {
  document.getElementById('total-amount').innerText = numeral(totalAmount).format('$0,0.00');
}
