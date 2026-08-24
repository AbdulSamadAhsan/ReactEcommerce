import React, { useMemo, useState } from 'react';
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
import Hero from "./Hero";
import Footer from "./Footer";
import { Link } from "react-router-dom";


export default function Home() {
   const [menuOpen, setMenuOpen] = useState(false);
  const [reviewIndex, setReviewIndex] = useState(0);
 
    return (
   <>
  


    <div>
      <div className="promo-bar">
        <span>Sign up and get 20% off to your first order. <u>Sign Up Now</u></span>
        <X size={18} />
      </div>

      <header className="header shell">
        <button className="icon-btn mobile-only" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu"><Menu /></button>
        <a className="logo" href="#">SHOP.CO</a>
        <nav className={`nav ${menuOpen ? 'open' : ''}`}>
          <a href="#">Shop <ChevronDown size={16} /></a>
          <a href="#new">On Sale</a>
          <a href="#new">New Arrivals</a>
          <a href="#brands">Brands</a>

      <Link to="/cart">View Cart</Link>
        </nav>
        <div className="search-box"><Search size={20} /><input placeholder="Search for products..." /></div>
        <div className="header-icons"><Search className="mobile-only" /><ShoppingCart /><UserRound /></div>
      </header>

  <Hero/>
      <Footer/>
    </div>

   </>
  )
}
