import { hasDiscount } from '../discount';
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
export default function ProductCard({item}) {
  return (
 <>
    <article className="product-card">
    
      <div className="product-image-wrap"><img src={item.image} alt={item.name} /></div>
               <Link to={`/products/${item._id}`}> <h3>{item.name}</h3></Link>
      <Rating value={item.rating} />
      <div className="price-row">
        <strong>${item.price}</strong>
        {Number(item.oldPrice) > 0 && <del>${item.oldPrice}</del>}
        {hasDiscount(item.discount) && <span className="discount">{item.discount}</span>}
      </div>
    </article>
 
 </>
  )
}
