import { BasicDate } from '../lib/dates';

export interface Transaction {
  fund: string;
  symbol: string | null;
  shares: number;
  price: number;
  amount: number;
}

export interface CheckedTransaction extends Transaction {
  /** Has discrepancy in Shares × Price = Amount */
  hasWrongShares: boolean;
  /** Price from Yahoo! Finance */
  correctPrice: number | null;
  /** Has discrepancy in price (e.g., doesn't match price from Yahoo! Finance) */
  hasWrongPrice: boolean | null;
}

export interface ActivityData {
  /** Date of reinvestment transactions */
  date: BasicDate;
  transactions: Transaction[];
}
