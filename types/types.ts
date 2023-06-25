import { BasicDate } from '../lib/dates';

export interface Transaction {
  fund: string;
  symbol: string | null;
  shares: number;
  price: number;
  amount: number;
  hasWrongShares?: boolean;
  hasWrongPrice?: boolean;
  correctPrice?: number;
}

export interface ActivityData {
  date: BasicDate;
  transactions: Transaction[];
}
