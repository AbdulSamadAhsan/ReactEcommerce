
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
 Minus,
 Trash2 ,
  Plus,
  Tag,
} from 'lucide-react';
import React, { useMemo, useState } from 'react';
import "./Cart.css";
import Footer from './Footer';

const cartItems = [
  {
    name: 'Gradient Graphic T-shirt',
    size: 'Large',
    color: 'White',
    price: 145,
    image: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=900&q=85',
  },
  {
    name: 'Checked Shirt',
    size: 'Medium',
    color: 'Red',
    price: 180,
   image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=900&q=85',
  },
  {
    name: 'Skinny Fit Jeans',
    size: 'Large',
    color: 'Blue',
    price: 240,
  image: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=900&q=85',
  },
]



function CartItem({ item }) {
  return (
    <div className="cart-item">
      <img src={item.image} alt={item.name} className="product-image" />

      <div className="item-copy">
        <div className="item-title">{item.name}</div>
        <div className="item-meta"><span>Size:</span> {item.size}</div>
        <div className="item-meta"><span>Color:</span> {item.color}</div>
        <div className="item-price">${item.price}</div>
      </div>

      <Trash2 className="trash" size={22} fill="#ff3333" color="#ff3333" strokeWidth={1.9} />

      <div className="quantity-pill" aria-hidden="true">
        <Minus size={18} />
        <span>2</span>
        <Plus size={18} />
      </div>
    </div>
  )
}

function OrderSummary() {
  return (
    <aside className="summary-card">
      <h2>Order Summary</h2>

      <div className="summary-row muted">
        <span>Subtotal</span>
        <strong>$565</strong>
      </div>
      <div className="summary-row muted">
        <span>Discount (-20%)</span>
        <strong className="discount">-$113</strong>
      </div>
      <div className="summary-row muted last-before-rule">
        <span>Delivery Fee</span>
        <strong>$15</strong>
      </div>

      <div className="summary-divider" />

      <div className="summary-row total-row">
        <span>Total</span>
        <strong>$467</strong>
      </div>

      <div className="promo-form">
        <div className="promo-input">
          <Tag size={19} color="#8c8c8c" />
          <span>Add promo code</span>
        </div>
        <button type="button">Apply</button>
      </div>

      <button className="checkout-button" type="button">
        Go to Checkout <ArrowRight size={22} />
      </button>
    </aside>
  )
}

function Newsletter() {
  return (
    <section className="newsletter page-shell">
      <div className="newsletter-title">STAY UPTO DATE ABOUT<br />OUR LATEST OFFERS</div>
      <div className="newsletter-form">
        <div className="email-field">
          <Mail size={18} color="#8a8a8a" />
          <span>Enter your email address</span>
        </div>
        <button type="button">Subscribe to Newsletter</button>
      </div>
    </section>
  )
}

// function Footer() {
//   return (
//     <footer className="footer">
//       <Newsletter />

//       <div className="page-shell footer-grid">
//         <div className="brand-column">
//           <div className="logo footer-logo">SHOP.CO</div>
//           <p>We have clothes that suits your style and<br />which you’re proud to wear. From<br />women to men.</p>
//           <div className="socials">
//             {/* <span><Twitter size={14} /></span>
//             <span className="dark"><Facebook size={14} fill="white" /></span>
//             <span><Instagram size={14} /></span>
//             <span><Github size={14} /></span> */}
//           </div>
//         </div>

//         <div className="footer-column">
//           <h4>COMPANY</h4>
//           <a href="#">About</a>
//           <a href="#">Features</a>
//           <a href="#">Works</a>
//           <a href="#">Career</a>
//         </div>
//         <div className="footer-column">
//           <h4>HELP</h4>
//           <a href="#">Customer Support</a>
//           <a href="#">Delivery Details</a>
//           <a href="#">Terms &amp; Conditions</a>
//           <a href="#">Privacy Policy</a>
//         </div>
//         <div className="footer-column">
//           <h4>FAQ</h4>
//           <a href="#">Account</a>
//           <a href="#">Manage Deliveries</a>
//           <a href="#">Orders</a>
//           <a href="#">Payments</a>
//         </div>
//         <div className="footer-column">
//           <h4>RESOURCES</h4>
//           <a href="#">Free eBooks</a>
//           <a href="#">Development Tutorial</a>
//           <a href="#">How to - Blog</a>
//           <a href="#">Youtube Playlist</a>
//         </div>
//       </div>

//       <div className="page-shell footer-bottom">
//         <div>Shop.co © 2000-2023, All Rights Reserved</div>
//         <div className="payment-row">
//           <span className="payment visa">VISA</span>
//           <span className="payment">🔴🟠</span>
//           <span className="payment paypal">PayPal</span>
//           <span className="payment"> Pay</span>
//           <span className="payment">G Pay</span>
//         </div>
//       </div>
//     </footer>
//   )
// }
  function Header(){
    const [menuOpen, setMenuOpen] = useState(false);
      const [reviewIndex, setReviewIndex] = useState(0);
    return(
      <>
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
        </nav>
        <div className="search-box"><Search size={20} /><input placeholder="Search for products..." /></div>
        <div className="header-icons"><Search className="mobile-only" /><ShoppingCart /><UserRound /></div>
      </header>
</>
    )
  }
export default function App() {
  return (
    <div className="app">
      <Header />

      <main className="page-shell main-content">
        <div className="breadcrumb">
          <span>Home</span>
          {/* <ChevronRight size={18} /> */}
          <span className="active">Cart</span>
        </div>

        <h1>YOUR CART</h1>

        <div className="cart-layout">
          <section className="cart-card">
            {cartItems.map((item) => (
              <CartItem key={item.name} item={item} />
            ))}
          </section>

          <OrderSummary />
        </div>
      </main>

    <Footer/>
    </div>
  )
}
