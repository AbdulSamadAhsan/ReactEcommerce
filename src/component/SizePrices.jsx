import React from 'react';
import { useCurrency } from '../CurrencyContext';
import { sizePricing } from '../sizePricing';
import './SizePrices.css';

export default function SizePrices({ product }) {
  const { money } = useCurrency();
  if (!product.sizes?.length) return null;
  const prices = product.sizes.map(size => ({ size, price: money(sizePricing(product, size).price) }));
  if (new Set(prices.map(row => row.price)).size < 2) return null;
  return <ul className="size-price-list" aria-label="Prices by size">
    {prices.map(({ size, price }) => <li key={size}>
      <span>{size}</span><strong>{price}</strong>
    </li>)}
  </ul>;
}
