import { hasDiscount } from '../discount';
import { useCurrency } from '../CurrencyContext';
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
import { discountLabel } from '../productPricing';
export default function ProductCard({item}) {
  const { money } = useCurrency();
  return (
 <>
    <article className="product-card">
    
      <Link to={`/products/${item._id}`} aria-label={`View ${item.name}`}>
        <div className="product-image-wrap"><img src={item.image} alt={item.name} /></div>
        <h3>{item.name}</h3>
      </Link>
      <Rating value={item.rating} />
      <div className="price-row">
        <strong>{money(item.price)}</strong>
        {Number(item.oldPrice) > 0 && <del>{money(item.oldPrice)}</del>}
        {hasDiscount(item.discount) && <span className="discount">{item.discount}</span>}
      </div>
    </article>
 
 </>
  )
}
