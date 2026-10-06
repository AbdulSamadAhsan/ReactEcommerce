import React, { useState } from "react";
import "./Header.css";
import {
  Search,
  ShoppingCart,
  UserRound,
  ChevronDown,
  Menu,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";
import { getAuthToken, getCurrentUser, logout } from '../api';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [promoOpen, setPromoOpen] = useState(true);
  const [user, setUser] = useState(getCurrentUser());
  React.useEffect(() => { const update = () => setUser(getCurrentUser()); window.addEventListener('shopco:auth', update); return () => window.removeEventListener('shopco:auth', update); }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      {promoOpen && (
        <div className="promo-bar">
          <span>
            Sign up and get 20% off to your first order.{" "}
            <Link to="/signup">Sign Up Now</Link>
          </span>

          <button
            className="promo-close"
            onClick={() => setPromoOpen(false)}
            aria-label="Close promotion"
          >
            <X size={18} />
          </button>
        </div>
      )}

      <header className="header shell">
        {/* Mobile Menu Button */}
        <button
          className="icon-btn mobile-only"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
        >
          {menuOpen ? <X /> : <Menu />}
        </button>

        {/* Logo */}
        <Link className="logo" to="/" onClick={closeMenu}>
          SHOP.CO
        </Link>

        {/* Navigation */}
        <nav className={`nav ${menuOpen ? "open" : ""}`}>
          <Link to="/shop" onClick={closeMenu}>
            Shop <ChevronDown size={16} />
          </Link>

          <Link to="/sale" onClick={closeMenu}>
            On Sale
          </Link>

          <Link to="/new-arrivals" onClick={closeMenu}>
            New Arrivals
          </Link>

          <Link to="/brands" onClick={closeMenu}>
            Brands
          </Link>

       
        </nav>

        {/* Desktop Search */}
        <div className="search-box">
          <Search size={20} />
          <input
            type="search"
            placeholder="Search for products..."
            aria-label="Search for products"
          />
        </div>

        {/* Header Icons */}
        <div className="header-icons">
          <button className="mobile-only icon-btn" aria-label="Search">
            <Search />
          </button>

          <Link to="/cart" aria-label="Shopping cart">
            <ShoppingCart />
          </Link>

          <Link to="/account" aria-label="Account">
            <UserRound />
          </Link>
          {getAuthToken() ? <button className="icon-btn" onClick={logout} title={user?.name ? `Log out ${user.name}` : 'Log out'}>Log out</button> : <Link to="/login">Log in</Link>}
        </div>
      </header>
    </>
  );
}
