import React, { useState } from 'react'
import { api } from '../api';
import "./footer.css";
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
export default function Footer() {
  const [email, setEmail] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  async function subscribe(event) {
    event.preventDefault(); setBusy(true); setMessage('');
    try { await api('/newsletter', { method: 'POST', body: { email } }); setMessage('You are subscribed. Thank you!'); setEmail(''); }
    catch (error) { setMessage(error.message); }
    finally { setBusy(false); }
  }
  return (


    <>
    
    <footer className="footer">
        <div className="shell newsletter"><h2>STAY UPTO DATE ABOUT OUR LATEST OFFERS</h2><form className="subscribe" onSubmit={subscribe}><label><Mail size={20}/><input type="email" required aria-label="Newsletter email" maxLength={254} value={email} onChange={event => setEmail(event.target.value)} placeholder="Enter your email address" /></label><button disabled={busy}>{busy ? 'Subscribing…' : 'Subscribe to Newsletter'}</button>{message && <p role="status">{message}</p>}</form></div>
        <div className="shell footer-grid">
         
          <div><h4>COMPANY</h4><a>About</a><a>Features</a><a>Works</a><a>Career</a></div>
          <div><h4>HELP</h4><a>Customer Support</a><a>Delivery Details</a><a>Terms & Conditions</a><a>Privacy Policy</a></div>
          <div><h4>FAQ</h4><a>Account</a><a>Manage Deliveries</a><a>Orders</a><a>Payments</a></div>
          <div><h4>RESOURCES</h4><a>Free eBooks</a><a>Development Tutorial</a><a>How to - Blog</a><a>Youtube Playlist</a></div>
        </div>
        <div className="shell footer-bottom"><span>Shop.co © 2000-2026, All Rights Reserved</span><span>VISA · mastercard · PayPal · Pay · G Pay</span></div>
      </footer>
    </>
  )
}
