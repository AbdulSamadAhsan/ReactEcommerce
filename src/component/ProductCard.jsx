import { hasDiscount } from '../discount';
import { useCurrency } from '../CurrencyContext';
import { catalogPricing } from '../sizePricing';
import React from 'react'
import {
  Search,
  ShoppingCart,
  UserRound,
  ChevronDown,
  Menu,
  X,
  Star,
  ArrowLeft,
  ArrowRight,
  Mail,

} from 'lucide-react';
import { Link } from "react-router-dom";
import Rating from './Rating';
import SizePrices from './SizePrices';
import { discountLabel } from '../productPricing';
export default function ProductCard({item}) {
  const { money } = useCurrency();
  const price = catalogPricing(item);
  return (
 <>
    <article className="product-card">
    
      <Link to={`/products/${item._id}`} aria-label={`View ${item.name}`}>
        <div className="product-image-wrap"><img src={item.image} alt={item.name} /></div>
        <h3>{item.name}</h3>
      </Link>
      <Rating value={item.rating} />
      <div className="price-row">
        <strong>{price.varies ? 'From ' : ''}{money(price.price)}</strong>
        {Number(price.oldPrice) > 0 && <del>{money(price.oldPrice)}</del>}
        {hasDiscount(item.discount) && <span className="discount">{item.discount}</span>}
      </div>
      <SizePrices product={item} />
    </article>
 
 </>
  )
}
