import React from 'react';
import { useCurrency } from '../CurrencyContext';
import { sizePricing } from '../sizePricing';
import './SizePrices.css';

export default function SizePrices({ product }) {
  const { money } = useCurrency();
  if (!product.sizes?.length) return null;
  return <ul className="size-price-list" aria-label="Prices by size">
    {product.sizes.map(size => <li key={size}>
      <span>{size}</span><strong>{money(sizePricing(product, size).price)}</strong>
    </li>)}
  </ul>;
}
