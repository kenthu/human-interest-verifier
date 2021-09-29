'use strict';

import {parseActivity} from './parser.js';
import {checkShares} from './verifier.js';
import numeral from 'numeral';

import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

window.onload = function() {
  window.addEventListener('paste', (event) => {
    const paste = (event.clipboardData || window.clipboardData).getData('text');

    // This where the code will go when I'm done!
    console.log(paste);

    event.preventDefault();
  });

  // TEST CODE: REMOVE ME LATER
  // For now, develop here ...

  const activityData = parseActivity(INCOMING_PASTE);
  checkShares(activityData.transactions);

  // Switch pages
  document.getElementById('results').style.display = '';
  document.getElementById('before-paste').style.display = 'none';

  populateBreakdownTable(
      activityData.transactions,
      document.getElementById('breakdown-body'),
      activityData.dateEpoch);

  // Display all checks

  // console.log(verifyFdic(activityData));
  console.log(activityData);
};

/**
 * Display activity data as table
 * @param {Object[]} transactions
 * @param {Element} tbody
 * @param {number} dateEpoch - date of transactions as epoch timestamp
 */
function populateBreakdownTable(transactions, tbody, dateEpoch) {
  for (const transaction of transactions) {
    const shares = numeral(transaction.shares).format('0,0.000');
    const price = numeral(transaction.price).format('$0,0.00');
    const amount = numeral(transaction.amount).format('$0,0.00');

    // Couldn't find a templating engine supporting ESM, so just build elements in JS
    const tr = document.createElement('tr');
    if (transaction.has_wrong_shares) tr.classList.add('table-danger');
    tr.appendChild(tdWithText(transaction.fund));
    tr.appendChild(tdWithText(transaction.symbol));
    tr.appendChild(tdWithText(shares, 'text-right'));
    tr.appendChild(tdPrice(transaction.symbol, dateEpoch, price));
    tr.appendChild(tdWithText(amount, 'text-right'));
    tr.appendChild(tdVerification(transaction, shares, price, amount));

    tbody.appendChild(tr);
  }
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

/**
 * Create td for Price column. If symbol provided, link to price history for this fund
 * @param {string} symbol
 * @param {number} dateEpoch - date of transactions as epoch timestamp
 * @param {string} price - price, formatted
 * @return {Element} td element
 */
function tdPrice(symbol, dateEpoch, price) {
  if (!symbol) return tdWithText(price, 'text-right');
  const td = document.createElement('td');
  td.classList.add('text-right');
  const a = document.createElement('a');
  a.href = priceHistoryUrl(symbol, dateEpoch);
  a.target = '_blank';
  a.appendChild(document.createTextNode(price));
  td.appendChild(a);
  return td;
}

/**
 * Return link to price history for this fund at Yahoo! Finance
 * @param {string} symbol
 * @param {number} dateEpoch
 * @return {string} URL
 */
function priceHistoryUrl(symbol, dateEpoch) {
  const startDate = dateEpoch - 86400 * 2;
  const endDate = dateEpoch + 86400 * 3;
  return `https://finance.yahoo.com/quote/${symbol}/history?period1=${startDate}&period2=${endDate}`;
}

/**
 * Create td for Verification column. Show pass/error icon and message
 * @param {Object} transaction
 * @param {string} shares - shares, formatted
 * @param {string} price - price, formatted
 * @param {string} amount - amount, formatted
 * @return {Element} td element
 */
function tdVerification(transaction, shares, price, amount) {
  const td = document.createElement('td');
  if (transaction.has_wrong_shares) {
    td.innerHTML = '<i class="fas fa-times-circle"></i>';
    const expectedShares = numeral(transaction.amount / transaction.price).format('0,0.000');
    td.appendChild(document.createTextNode(` There should be ${expectedShares} shares, not ${shares}`));
    td.appendChild(document.createElement('br'));
    const small = document.createElement('small');
    small.appendChild(document.createTextNode(`${amount} / ${price} = ${expectedShares}`));
    td.appendChild(small);
  } else {
    td.innerHTML = '<i class="fas fa-check-circle"></i>';
    td.appendChild(document.createTextNode(' Pass'));
  }
  return td;
}
