window.onload = function() {
  window.addEventListener('paste', (event) => {
      let paste = (event.clipboardData || window.clipboardData).getData('text');
      parseOutput = parseActivity(paste);
      event.preventDefault();
  });
}

function parseActivity(pastedActivity) {
  // This regex matches starting with the date of the reinvestment activity, all the way until the
  // end of the pasted string
  const reinvestmentActivityRegex = /(\d{1,2}\/\d{1,2}\/\d{4})\nAssets from a previous provider totaling \$([\d,.]+) were reinvested\n(.+)/s;
  const match = pastedActivity.match(reinvestmentActivityRegex);
  const date = match[1];
  const total = parseFloat(match[2].replace(/,/g, ''));
  const remainingLines = match[3].split(/\r?\n/);

  const transactions = [];
  for (const line of remainingLines) {
    if (line.match(/^\d{1,2}\/\d{1,2}\/\d{4}$/)) {
      // Date found, which means we've reached the next group of transactions, so we're done
      break;
    } else if (line.match(/^Fund\s+Symbol\s+Shares\s+Price\s+Amount\s+$/)) {
      // Skip header line
      continue;
    }
    transactions.push(parseTransaction(line));
  }

  return {
    date: date,
    total: total,
    transactions: transactions
  }
}

// Parse pasted line into object representing a transaction
// Example lines:
// FDIC Insured Deposit Account        -27163.370  $1.00   -$27,163.37
// Vanguard Total Stock Market Index Fund Admiral  VTSAX   24.594  $92.62  $2,277.89
function parseTransaction(line) {
  const regex = /(?<fund>.+?)(?<symbol>\s+[A-Z]{3,5})?\s+(?<shares>-?\d*\.\d+)\s+\$(?<price>\d+\.\d+)\s+(?<amount>-?\$[\d,]+\.\d+)/;
  const lineMatch = line.match(regex);
  if (!lineMatch) throw new Error('Unable to parse line: ' + line);

  return {
    fund: lineMatch.groups.fund,
    symbol: lineMatch.groups.symbol ? lineMatch.groups.symbol.trim() : null,
    shares: parseFloat(lineMatch.groups.shares),
    price: parseFloat(lineMatch.groups.price),
    amount: parseFloat(lineMatch.groups.amount.replace(/\$/g, ''))
  };
}
