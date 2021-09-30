'use strict';

import {parseActivity, convertDateTupleToUnixTimestamp} from './parser.js';
import {checkShares} from './verifier.js';
import {format} from 'date-fns';
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
      activityData.dateTuple);

  populateAllocationTable(
      activityData.transactions,
      document.getElementById('allocation-body'));

  // Display all checks
  check1Show(activityData.transactions);
  check2Show(activityData.dateTuple);
};

/**
 * Display activity data as table
 * @param {Object[]} transactions
 * @param {Element} tbody
 * @param {number[]} dateTuple - date of transactions as tuple of [year, month, day]
 */
function populateBreakdownTable(transactions, tbody, dateTuple) {
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
    tr.appendChild(tdPrice(transaction.symbol, dateTuple, price));
    tr.appendChild(tdWithText(amount, 'text-right'));
    tr.appendChild(tdVerification(transaction, shares, price, amount));

    tbody.appendChild(tr);
  }
}

/**
 * Display allocation data as table
 * @param {Object[]} transactions
 * @param {Element} tbody
 */
function populateAllocationTable(transactions, tbody) {
  const allocations = {};
  let totalAmount = 0;

  // Aggregate by fund
  for (const transaction of transactions) {
    if (transaction.fund in allocations) {
      allocations[transaction.fund].amount += transaction.amount;
    } else {
      allocations[transaction.fund] = {symbol: transaction.symbol, amount: transaction.amount};
    }
    totalAmount += transaction.amount;
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
  const textToShow = transactions.some((transaction) => transaction.has_wrong_shares) ? 'check1-discrepancy' : 'check1-pass';
  document.getElementById(textToShow).style.display = '';
}

/**
 * Show verification results for check 2
 * @param {number[]} dateTuple - date of transactions as tuple of [year, month, day]
 */
function check2Show(dateTuple) {
  const prettyDate = format(new Date(dateTuple[0], dateTuple[1] - 1, dateTuple[2]), 'MMM dd, yyyy');
  document.getElementById('transaction-date').innerText = prettyDate;
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
 * @param {number[]} dateTuple - date of transactions as tuple of [year, month, day]
 * @param {string} price - price, formatted
 * @return {Element} td element
 */
function tdPrice(symbol, dateTuple, price) {
  if (!symbol) return tdWithText(price, 'text-right');
  const td = document.createElement('td');
  td.classList.add('text-right');
  const a = document.createElement('a');
  a.href = priceHistoryUrl(symbol, dateTuple);
  a.target = '_blank';
  a.appendChild(document.createTextNode(price));
  td.appendChild(a);
  return td;
}

/**
 * Return link to price history for this fund at Yahoo! Finance
 * @param {string} symbol
 * @param {number[]} dateTuple - date of transactions as tuple of [year, month, day]
 * @return {string} URL
 */
function priceHistoryUrl(symbol, dateTuple) {
  const unixTimestamp = convertDateTupleToUnixTimestamp(dateTuple);
  const startDate = unixTimestamp - 86400 * 2;
  const endDate = unixTimestamp + 86400 * 3;
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
