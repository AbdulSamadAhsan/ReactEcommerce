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
import { Link, useNavigate } from "react-router-dom";
import { getAuthToken, getCurrentUser, getCart, logout } from '../api';

function readCartCount() {
  try {
    const items = JSON.parse(localStorage.getItem('cart') || '[]');
    return Array.isArray(items) ? items.reduce((total, item) => {
      const quantity = Number(item.quantity);
      return total + (Number.isSafeInteger(quantity) && quantity > 0 ? quantity : 0);
    }, 0) : 0;
  } catch {
    return 0;
  }
}

export default function Header() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [promoOpen, setPromoOpen] = useState(true);
  const [user, setUser] = useState(getCurrentUser());
  const [cartCount, setCartCount] = useState(readCartCount);
  React.useEffect(() => {
    const controller = new AbortController();
    const update = () => setCartCount(readCartCount());
    const sync = () => { getCart(controller.signal).catch(() => {}); };
    const onStorage = event => {
      if (event.key === 'cart' || event.key === null) update();
    };
    window.addEventListener('shopco:cart', update);
    window.addEventListener('storage', onStorage);
    window.addEventListener('focus', sync);
    sync();
    return () => {
      controller.abort();
      window.removeEventListener('shopco:cart', update);
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('focus', sync);
    };
  }, []);
  React.useEffect(() => { const update = () => setUser(getCurrentUser()); window.addEventListener('shopco:auth', update); return () => window.removeEventListener('shopco:auth', update); }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      {promoOpen && (
        <div className="promo-bar">
          <span>
            Sign up and get 20% off to your first order.{" "}
            <Link to="/register">Sign Up Now</Link>
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
        <form className="search-box" role="search" onSubmit={event => { event.preventDefault(); navigate('/shop?search=' + encodeURIComponent(search.trim())); closeMenu(); }}>
          <Search size={20} />
          <input
            type="search"
            placeholder="Search for products..."
            aria-label="Search for products"
            value={search}
            onChange={event => setSearch(event.target.value)}
          />
        </form>

        {/* Header Icons */}
        <div className="header-icons">
          <button className="mobile-only icon-btn" aria-label="Search" onClick={() => navigate('/shop')}>
            <Search />
          </button>

          <Link to="/cart" className="cart-icon-link" aria-label={`Shopping cart, ${cartCount} ${cartCount === 1 ? 'item' : 'items'}`}>
            <ShoppingCart aria-hidden="true" />
            {cartCount > 0 && <span className="cart-count-badge" aria-hidden="true">{cartCount > 99 ? '99+' : cartCount}</span>}
          </Link>

          <Link to="/account" aria-label="Account">
            <UserRound />
          </Link>
          {getAuthToken() ? <button className="icon-btn" onClick={() => { logout(); navigate('/login', { replace: true }); }} title={user?.name ? `Log out ${user.name}` : 'Log out'}>Log out</button> : <Link to="/login">Log in</Link>}
        </div>
      </header>
    </>
  );
}
