'use strict';

import {parseActivity} from './parser.js';
import {checkShares} from './verifier.js';
import numeral from 'numeral';

import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

// TEST CODE: REMOVE ME LATER
const INCOMING_PASTE = `Dividend
Your investment earned $199.76.
12/9/2020
Assets from a previous provider totaling $62,640.99 were reinvested
Fund    Symbol  Shares  Price   Amount 
FDIC Insured Deposit Account        -27163.370  $1.00   -$27,163.37
FDIC Insured Deposit Account        -436.190    $1.00   -$436.19
Vanguard REIT Index Admiral VGSLX   43.281  $120.18 $5,201.50
Vanguard Total International Bond Index Admiral VTABX   98.710  $23.42  $2,311.78
FDIC Insured Deposit Account        -5201.500   $1.00   -$5,201.50
FDIC Insured Deposit Account        -2277.890   $1.00   -$2,277.89
Vanguard REIT Index Admiral VGSLX   3.629   $120.18 $436.19
FDIC Insured Deposit Account        -5201.500   $1.00   -$5,201.50
Vanguard Total International Stock Index Admiral    VTIAX   561.815 $31.89  $17,916.27
FDIC Insured Deposit Account        -2311.780   $1.00   -$2,311.78
Vanguard Total International Stock Index Admiral    VTIAX   47.113  $31.89  $1,502.44
Vanguard Total Stock Market Index Fund Admiral  VTSAX   293.278 $92.62  $27,163.37
Vanguard Total Bond Market Index Admiral    VBTLX   37.635  $11.59  $436.19
FDIC Insured Deposit Account        -1502.440   $1.00   -$1,502.44
FDIC Insured Deposit Account        -193.860    $1.00   -$193.86
Vanguard Total Stock Market Index Fund Admiral  VTSAX   24.594  $92.62  $2,277.89
Vanguard Total International Bond Index Admiral VTABX   8.278   $23.42  $193.86
FDIC Insured Deposit Account        -436.190    $1.00   -$436.19
FDIC Insured Deposit Account        -17916.270  $1.00   -$17,916.27
Vanguard Total Bond Market Index Admiral    VBTLX   448.792 $11.59  $5,201.50
12/4/2020
Contribution
You contributed $825.00 and your employer contributed $75.00 for pay date 11/30/2020.
11/30/2020
Divide`;

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
    td.innerHTML = '<i class="fas fa-exclamation-triangle"></i>';
    const expectedShares = numeral(transaction.amount / transaction.price).format('0,0.000');
    td.appendChild(document.createTextNode(` There should be ${expectedShares} shares, not ${shares}`));
    td.appendChild(document.createElement('br'));
    const small = document.createElement('small');
    small.appendChild(document.createTextNode(`${amount} / ${price} = ${expectedShares}`));
    td.appendChild(small);
  } else {
    td.innerHTML = '<i class="fas fa-check"></i>';
    td.appendChild(document.createTextNode(' Pass'));
  }
  return td;
}
