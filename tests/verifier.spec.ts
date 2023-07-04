import { test, expect } from '@playwright/test';

/**
 * Simulate pasting from a clipboard
 */
const paste = async (clipboardContent: string) => {
  let pasteEvent = new Event('paste', { bubbles: true, cancelable: true });
  pasteEvent = Object.assign(pasteEvent, {
    clipboardData: {
      getData: () => {
        return clipboardContent;
      },
    },
  });
  document.dispatchEvent(pasteEvent);
};

test('Home link', async ({ page }) => {
  await page.goto('/verifier');
  await page.getByRole('link', { name: 'Home', exact: true }).click();
  await expect(page).toHaveURL('');
});

test('Get error if paste invalid input', async ({ page }) => {
  await page.goto('/verifier');
  await page.evaluate(paste, 'INVALID INPUT');
  await expect(page.getByRole('status').filter({ hasText: 'unable to find' })).toBeVisible();
});

test('Shows discrepancies if checks fail', async ({ page }) => {
  const input = `
12/09/2020

Plan Conversion
TRADITIONAL CONTRIBUTION
FUND  SHARES  PRICE AMOUNT
FDIC Insured Deposit Account  -1.000 $1.00 -$1.00
Vanguard REIT Index Admiral VGSLX 2.068 $120.18 $1,286.39
Vanguard Total Bond Market Index Admiral VBTLX  0.000 $11.49  $0.00
Need help? Head to our Support Center.`;

  await page.goto('/verifier');
  await page.evaluate(paste, input);

  // Expect discrepancy message for check #1
  await expect(
    page.getByText(
      /DISCREPANCY.*You received the wrong number of shares for one or more transactions\./,
    ),
  ).toBeVisible();

  // Expect discrepancy message for check #2
  await expect(
    page.getByText(
      /DISCREPANCY.*Your shares were bought at the incorrect price for one or more transactions\./,
    ),
  ).toBeVisible();

  // Expect discrepancy messages in breakdown table
  await expect(page.getByText('You should have received 10.704 shares, not 2.068')).toBeVisible();
  await expect(
    page.getByText('The price on Dec 09, 2020 was actually $11.59, not $11.49'),
  ).toBeVisible();
});

test('Show passes if checks pass', async ({ page }) => {
  const input = `
12/09/2020

Plan Conversion
TRADITIONAL CONTRIBUTION
FUND  SHARES  PRICE AMOUNT
FDIC Insured Deposit Account  -1.000 $1.00 -$1.00
Vanguard REIT Index Admiral VGSLX 10.704 $120.18 $1,286.39
Need help? Head to our Support Center.`;

  await page.goto('/verifier');
  await page.evaluate(paste, input);

  // Expect pass message for check #1
  await expect(
    page.getByText(
      /PASS.*You received the correct number of shares for all transactions in the reinvestment\./,
    ),
  ).toBeVisible();

  // Expect pass message for check #2
  await expect(
    page.getByText(/PASS.*All reinvested funds were purchased at the correct price\./),
  ).toBeVisible();
});
