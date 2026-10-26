import React, { useEffect, useRef, useState } from 'react';
import { useCurrency } from '../CurrencyContext';
import { formatMoney } from '../currency';
import { Link, Navigate } from 'react-router-dom';
import { Minus, Plus, Trash2, ArrowRight, Tag, X } from 'lucide-react';
import { getCart, saveCart } from '../api';
import Header from './Header';
import Footer from './Footer';
import Swal from 'sweetalert2';
import './Cart.css';

export default function Cart() {
  const { currency: storeCurrency, exchangeRate } = useCurrency();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [promo, setPromo] = useState('');
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true); setError('');
    getCart(controller.signal).then(c => { setCart(c); setPromo(c.promoCode); })
      .catch(e => { if (e.name !== 'AbortError') setError(e.message); })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [retry, storeCurrency, exchangeRate]);
  async function update(items, code = cart.promoCode) {
    setBusy(true); setError('');
    try { const c = await saveCart(cart, items, items.length ? code : ''); setCart(c); setPromo(c.promoCode); }
    catch (e) { setError(e.message); if (e.status === 409) { try { setCart(await getCart()); } catch {} } }
    finally { setBusy(false); }
  }
  const confirmingRemoval = useRef(false);
  async function confirmCouponRemoval() {
    if (busy || confirmingRemoval.current) return;
    confirmingRemoval.current = true;
    try {
      const result = await Swal.fire({
        title: 'Remove coupon?',
        text: 'Your coupon discount will be removed and your order total will be updated.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, remove coupon',
        cancelButtonText: 'Keep coupon',
        confirmButtonColor: '#b42318',
        cancelButtonColor: '#333333',
        focusCancel: true,
        customClass: { popup: 'cart-removal-dialog' },
      });
      if (result.isConfirmed) await update(cart.items, '');
    } finally { confirmingRemoval.current = false; }
  }
  async function confirmRemoval(index) {
    if (busy || confirmingRemoval.current) return;
    confirmingRemoval.current = true;
    try {
      const all = index === undefined;
      const result = await Swal.fire({
        title: all ? 'Clear your cart?' : 'Remove this item?',
        text: all ? 'All items and any applied coupon will be removed from your cart.' : `${cart.items[index].name} will be removed from your cart.`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: all ? 'Yes, clear cart' : 'Yes, remove item',
        cancelButtonText: 'Keep shopping cart',
        confirmButtonColor: '#b42318',
        cancelButtonColor: '#333333',
        focusCancel: true,
        customClass: { popup: 'cart-removal-dialog' },
      });
      if (result.isConfirmed) await update(all ? [] : cart.items.filter((_, i) => i !== index));
    } finally { confirmingRemoval.current = false; }
  }
  const totals = cart?.totals;
  const money = value => formatMoney(value, cart?.currency || totals?.currency || 'USD');
  if (!loading && cart?.items.length === 0) return <Navigate to="/shop" replace />;
  return <div className="app"><Header /><main className="page-shell main-content"><div className="breadcrumb"><Link to="/">Home</Link><span className="active">Cart</span></div><div className="cart-title-row"><h1>YOUR CART</h1>{!loading && cart?.items.length > 0 && <button type="button" className="clear-cart-button" disabled={busy} onClick={() => confirmRemoval()}><Trash2 size={18} aria-hidden="true" /><span>Clear cart</span></button>}</div>
    {error && <p role="alert">{error} <button disabled={busy} onClick={() => setRetry(n => n + 1)}>Refresh cart</button></p>}
    {loading ? <p role="status">Loading your cart…</p> : cart && <div className="cart-layout" aria-busy={busy}>
      <section className="cart-card">{cart.items.length === 0 ? <div className="empty-cart"><h2>Your cart is empty</h2><p>Add some products to your cart.</p><Link to="/shop" className="continue-shopping">Continue Shopping</Link></div> : <>
        {cart.items.map((item, index) => <div className="cart-item" key={`${item.productId}-${item.size}-${item.color}`}>
          <Link to={`/products/${item.productId}`}>{item.image && <img className="product-image" src={item.image} alt={item.name} />}</Link>
          <div className="item-copy"><Link to={`/products/${item.productId}`} className="item-title">{item.name}</Link><div className="item-meta"><span>Size:</span> {item.size}</div><div className="item-meta"><span>Color:</span> <span style={{ display: 'inline-block', width: 12, height: 12, borderRadius: '50%', border: '1px solid #aaa', background: item.color }} /> {item.color}</div><div className="item-price">{money(item.price)}</div>{!item.available && <p role="status">This selection is unavailable. Reduce its quantity or remove it.</p>}</div>
          <button type="button" className="trash" aria-label={`Remove ${item.name}`} disabled={busy} onClick={() => confirmRemoval(index)} style={{ border: 0, background: 'transparent', color: '#ff3333' }}><Trash2 size={22} /></button>
          <div className="quantity-pill"><button className="quantity-button" aria-label={`Decrease quantity of ${item.name}`} disabled={busy || item.quantity <= 1} onClick={() => update(cart.items.map((p, i) => i === index ? { ...p, quantity: p.quantity - 1 } : p))}><Minus size={18} /></button><span aria-live="polite">{item.quantity}</span><button className="quantity-button" aria-label={`Increase quantity of ${item.name}`} disabled={busy || item.quantity >= Math.min(item.stock, 20)} onClick={() => update(cart.items.map((p, i) => i === index ? { ...p, quantity: p.quantity + 1 } : p))}><Plus size={18} /></button></div>
        </div>)}
        {cart.message && <div role="alert"><p>{cart.message}</p><button disabled={busy} onClick={() => confirmRemoval()}>Clear unavailable cart</button></div>}
      </>}</section>
      <aside className="summary-card"><h2>Order Summary</h2>
        {[['Subtotal', totals?.subtotal], [cart.promoCode ? 'Discount (' + cart.promoCode + ')' : 'Discount', totals ? -totals.discount : undefined], ['GST (16%)', totals?.gst], ['Delivery Fee', totals?.deliveryFee]].map(([label, value]) => <div className="summary-row muted" key={label}><span>{label}</span><strong>{value === undefined ? '—' : money(value)}</strong></div>)}
        <div className="summary-divider" /><div className="summary-row total-row"><span>Total</span><strong>{totals ? money(totals.total) : '—'}</strong></div>
        <form className="promo-form" onSubmit={e => { e.preventDefault(); const code = promo.trim().toUpperCase(); update(cart.items, code); }}><div className="promo-input"><Tag size={19} /><input aria-label="Promo code" placeholder="Add promo code" value={promo} disabled={busy} onChange={e => setPromo(e.target.value)} style={{ width: '100%', minWidth: 0, border: 0, background: 'transparent' }} /></div><button disabled={busy || !cart.items.length} type="submit">Apply</button></form>
        {cart.promoCode && <div className="cart-applied-coupon"><p role="status"><Tag size={16} aria-hidden="true" /><span><strong>{cart.promoCode}</strong> applied</span></p><button type="button" className="remove-coupon-button" disabled={busy} onClick={confirmCouponRemoval}><X size={16} aria-hidden="true" /><span>Remove code</span></button></div>}
        {cart.items.length > 0 && totals && !busy ? <Link to="/checkout" className="checkout-button">Go to Checkout <ArrowRight size={22} /></Link> : <button className="checkout-button" disabled>Go to Checkout <ArrowRight size={22} /></button>}
        {busy && <p role="status">Saving your cart…</p>}
      </aside>
    </div>}
  </main><Footer /></div>;
}
