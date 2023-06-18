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
 * Display allocation data as table
 * @param {Object[]} transactions
 * @param {Element} tbody
 * @param {number} totalAmount
 */
function populateAllocationTable(transactions, tbody, totalAmount) {
  const allocations = {};

  // Aggregate by fund
  for (const transaction of transactions) {
    if (transaction.fund in allocations) {
      allocations[transaction.fund].amount += transaction.amount;
    } else {
      allocations[transaction.fund] = { symbol: transaction.symbol, amount: transaction.amount };
    }
  }

  // Append one row for each fund
  for (const [fund, allocation] of Object.entries(allocations)) {
    const amountPctg = numeral(allocation.amount / totalAmount).format('0.00%');

    // Couldn't find a templating engine supporting ESM, so just build elements in JS
    const tr = document.createElement('tr');
    tr.appendChild(tdWithText(fund));
    tr.appendChild(tdWithText(allocation.symbol));
    tr.appendChild(tdWithText(amountPctg, 'text-right'));
    tbody.appendChild(tr);
  }
}

/**
 * Show verification results for check 1
 * @param {Object[]} transactions
 */
function check1Show(transactions) {
  const textToShow = transactions.some((transaction) => transaction.hasWrongShares)
    ? 'check1-discrepancy'
    : 'check1-pass';
  document.getElementById(textToShow).style.display = '';
}

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

/**
 * Create and return td with provided text
 * @param {string} text
 * @param {string} elementClass
 * @return {Element}
 */
function tdWithText(text, elementClass) {
  const td = document.createElement('td');
  td.appendChild(document.createTextNode(text));
  if (elementClass) td.classList.add(elementClass);
  return td;
}
