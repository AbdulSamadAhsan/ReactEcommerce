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


export default function Rating({value}) {
    const full = Math.floor(value);
  const partial = value % 1 !== 0;
  
  return (
<>

   <div className="rating-row" aria-label={`${value} out of 5 stars`}>
      <div className="stars">
        {Array.from({ length: full }).map((_, i) => <Star key={i} size={17} fill="currentColor" strokeWidth={0} />)}
        {partial && <Star size={17} fill="currentColor" strokeWidth={0} className="half-star" />}
      </div>
      <span>{value}/5</span>
    </div>

</>
  )
}
