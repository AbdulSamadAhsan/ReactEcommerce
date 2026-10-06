import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2, ArrowRight, Tag } from 'lucide-react';
import { getCart, saveCart } from '../api';
import Header from './Header';
import Footer from './Footer';
import './Cart.css';

const money = value => (Number(value) < 0 ? '-$' : '$') + Math.abs(Number(value)).toFixed(2);
export default function Cart() {
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
  }, [retry]);
  async function update(items, code = cart.promoCode) {
    setBusy(true); setError('');
    try { const c = await saveCart(cart, items, code); setCart(c); setPromo(c.promoCode); }
    catch (e) { setError(e.message); if (e.status === 409) { try { setCart(await getCart()); } catch {} } }
    finally { setBusy(false); }
  }
  const totals = cart?.totals;
  return <div className="app"><Header /><main className="page-shell main-content"><div className="breadcrumb"><Link to="/">Home</Link><span className="active">Cart</span></div><h1>YOUR CART</h1>
    {error && <p role="alert">{error} <button disabled={busy} onClick={() => setRetry(n => n + 1)}>Refresh cart</button></p>}
    {loading ? <p role="status">Loading your cart…</p> : cart && <div className="cart-layout" aria-busy={busy}>
      <section className="cart-card">{cart.items.length === 0 ? <div className="empty-cart"><h2>Your cart is empty</h2><p>Add some products to your cart.</p><Link to="/shop" className="continue-shopping">Continue Shopping</Link></div> : <>
        {cart.items.map((item, index) => <div className="cart-item" key={`${item.productId}-${item.size}-${item.color}`}>
          <Link to={`/products/${item.productId}`}>{item.image && <img className="product-image" src={item.image} alt={item.name} />}</Link>
          <div className="item-copy"><Link to={`/products/${item.productId}`} className="item-title">{item.name}</Link><div className="item-meta"><span>Size:</span> {item.size}</div><div className="item-meta"><span>Color:</span> <span style={{ display: 'inline-block', width: 12, height: 12, borderRadius: '50%', border: '1px solid #aaa', background: item.color }} /> {item.color}</div><div className="item-price">{money(item.price)}</div>{!item.available && <p role="status">This selection is unavailable. Reduce its quantity or remove it.</p>}</div>
          <button type="button" className="trash" aria-label={`Remove ${item.name}`} disabled={busy} onClick={() => update(cart.items.filter((_, i) => i !== index))} style={{ border: 0, background: 'transparent', color: '#ff3333' }}><Trash2 size={22} /></button>
          <div className="quantity-pill"><button className="quantity-button" aria-label={`Decrease quantity of ${item.name}`} disabled={busy || item.quantity <= 1} onClick={() => update(cart.items.map((p, i) => i === index ? { ...p, quantity: p.quantity - 1 } : p))}><Minus size={18} /></button><span aria-live="polite">{item.quantity}</span><button className="quantity-button" aria-label={`Increase quantity of ${item.name}`} disabled={busy || item.quantity >= Math.min(item.stock, 20)} onClick={() => update(cart.items.map((p, i) => i === index ? { ...p, quantity: p.quantity + 1 } : p))}><Plus size={18} /></button></div>
        </div>)}
        {cart.message && <div role="alert"><p>{cart.message}</p><button disabled={busy} onClick={() => update([])}>Clear unavailable cart</button></div>}
      </>}</section>
      <aside className="summary-card"><h2>Order Summary</h2>
        {[['Subtotal', totals?.subtotal], [cart.promoCode ? 'Discount (20%)' : 'Discount', totals ? -totals.discount : undefined], ['Delivery Fee', totals?.deliveryFee]].map(([label, value]) => <div className="summary-row muted" key={label}><span>{label}</span><strong>{value === undefined ? '—' : money(value)}</strong></div>)}
        <div className="summary-divider" /><div className="summary-row total-row"><span>Total</span><strong>{totals ? money(totals.total) : '—'}</strong></div>
        <form className="promo-form" onSubmit={e => { e.preventDefault(); const code = promo.trim().toUpperCase(); if (code && code !== 'WELCOME20') { setError('This promo code is not valid.'); return; } update(cart.items, code); }}><div className="promo-input"><Tag size={19} /><input aria-label="Promo code" placeholder="Add promo code" value={promo} disabled={busy} onChange={e => setPromo(e.target.value)} style={{ width: '100%', minWidth: 0, border: 0, background: 'transparent' }} /></div><button disabled={busy || !cart.items.length} type="submit">Apply</button></form>
        {cart.promoCode && <p role="status">WELCOME20 applied. <button disabled={busy} onClick={() => update(cart.items, '')}>Remove code</button></p>}
        {cart.items.length > 0 && totals && !busy ? <Link to="/checkout" className="checkout-button">Go to Checkout <ArrowRight size={22} /></Link> : <button className="checkout-button" disabled>Go to Checkout <ArrowRight size={22} /></button>}
        {busy && <p role="status">Saving your cart…</p>}
      </aside>
    </div>}
  </main><Footer /></div>;
}
