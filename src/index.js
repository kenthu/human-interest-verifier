import parseActivity from './parser.js';
import 'bootstrap/dist/css/bootstrap.min.css';

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

  // Display data as table, without FDIC negative values

  // Run all checks

  // Display all checks

  // console.log(verifyFdic(activityData));
  console.log(activityData);
};
