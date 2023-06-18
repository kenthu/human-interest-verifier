import { BasicDate } from '../../../lib/dates';
import { priceHistoryUrl } from '../../../lib/yahoo-finance';

interface PriceLinkProps {
  price: string;
  symbol: string | null;
  date: BasicDate;
}

export const PriceLink = ({ price, symbol, date }: PriceLinkProps): JSX.Element => {
  if (!symbol) {
    return <>{price}</>;
  }

  return (
    <a href={priceHistoryUrl(symbol, date)} target="_blank">
      {price}
    </a>
  );
};
