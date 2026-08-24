import React from 'react'
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
  return (


    <>
    
    <footer className="footer">
        <div className="shell newsletter"><h2>STAY UPTO DATE ABOUT OUR LATEST OFFERS</h2><div className="subscribe"><label><Mail size={20}/><input placeholder="Enter your email address" /></label><button>Subscribe to Newsletter</button></div></div>
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
