import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Banknote } from 'lucide-react';
import Header from './Header';
import { cartLine, createOrder, getCart, getCurrentUser, logout, saveCart } from '../api';
import './Checkout.css';

const fields = [
  ['firstName', 'First Name', 'given-name'], ['lastName', 'Last Name', 'family-name'],
  ['email', 'Email Address', 'email'], ['phone', 'Phone Number', 'tel'],
  ['address', 'Street Address', 'street-address'], ['city', 'City', 'address-level2'],
  ['state', 'State / Province', 'address-level1'], ['zip', 'ZIP / Postal Code', 'postal-code'],
  ['country', 'Country', 'country-name'],
];
const money = value => '$' + Number(value || 0).toFixed(2);
function readAttempt(key) {
  try { return JSON.parse(sessionStorage.getItem(key) || 'null'); } catch { return null; }
}

export default function Checkout() {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const storageKey = `shopco.checkout.${user?._id || 'user'}`;
  const [attempt, setAttempt] = useState(() => readAttempt(storageKey));
  const [form, setForm] = useState(() => {
    const saved = readAttempt(storageKey);
    return saved?.body?.shipping || Object.fromEntries(fields.map(([name]) => [name,
      user?.[name] || (name === 'firstName' ? user?.name?.trim().split(/\s+/)[0] : name === 'lastName' ? user?.name?.trim().split(/\s+/).slice(1).join(' ') : '') || '',
    ]));
  });
  const [cart, setCart] = useState(null);
  const [cartError, setCartError] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState(() => readAttempt(storageKey)?.notice || '');
  const [busy, setBusy] = useState(false);
  const [refresh, setRefresh] = useState(0);
  const submitting = useRef(false);
  const order = attempt?.order;

  useEffect(() => {
    if (order) return;
    const controller = new AbortController();
    setCartError('');
    getCart(controller.signal).then(setCart).catch(e => {
      if (e.name !== 'AbortError') setCartError(e.message);
    });
    return () => controller.abort();
  }, [refresh, order]);

  async function submit(event) {
    event.preventDefault();
    if (submitting.current || order || (!attempt && (!cart?.items.length || !cart.totals))) return;
    submitting.current = true;
    setBusy(true); setError('');
    let current = attempt;
    try {
      if (!current) {
        current = {
          key: crypto.randomUUID(),
          revision: cart.revision,
          body: {
            items: cart.items.map(cartLine),
            shipping: Object.fromEntries(fields.map(([name]) => [name, form[name].trim()])),
            promoCode: cart.promoCode || '',
            paymentMethod: 'cash_on_delivery',
          },
        };
        // Persist before sending so an uncertain response can be retried after a reload.
        sessionStorage.setItem(storageKey, JSON.stringify(current));
        setAttempt(current);
      }
      const placed = await createOrder(current.body, current.key);
      const completed = { ...current, order: placed };
      setAttempt(completed);
      try { sessionStorage.setItem(storageKey, JSON.stringify(completed)); } catch { /* Keep confirmation in memory. */ }
      try {
        // Use the submitted revision so changes made in another tab are never erased.
        await saveCart({ revision: current.revision }, [], '');
      } catch {
        const warning = 'Your order is confirmed, but your cart could not be cleared. Review your cart before ordering again.';
        setNotice(warning);
        try { sessionStorage.setItem(storageKey, JSON.stringify({ ...completed, notice: warning })); } catch { /* Keep confirmation in memory. */ }
      }
    } catch (e) {
      if (e.status === 401) {
        logout();
        navigate('/login', { state: { from: '/checkout' }, replace: true });
      } else {
        if (e.status === 400 || e.status === 409) {
          sessionStorage.removeItem(storageKey); setAttempt(null);
          setRefresh(value => value + 1);
        }
        setError(e.message || 'We could not confirm your order. Retry to check the same order safely.');
      }
    } finally {
      submitting.current = false; setBusy(false);
    }
  }

  const items = cart?.items || [];
  const totals = cart?.totals;
  return <><Header /><main className="checkout-page"><div className="checkout-container">
    <div className="checkout-breadcrumb"><Link to="/">Home</Link><span>Checkout</span></div>
    <h1 className="checkout-title">{order ? 'ORDER CONFIRMED' : 'CHECKOUT'}</h1>
    {order ? <section className="checkout-card" role="status">
      <h2>Thank you for your order</h2>
      <p>Order number: <strong>{order._id}</strong></p>
      <p>Total: <strong>{money(order.total)} {order.currency}</strong></p>
      <p>Payment: Cash on delivery. Your order is {order.status}.</p>
      {notice && <p role="alert">{notice}</p>}
      <Link to="/shop" onClick={() => sessionStorage.removeItem(storageKey)}>Continue shopping</Link>
    </section> : <>
      {cartError && <p role="alert">{cartError} <button type="button" onClick={() => setRefresh(n => n + 1)}>Refresh cart</button></p>}
      {error && <p role="alert">{error}</p>}
      {attempt ? <section className="checkout-card">
        <h2>{busy ? 'Placing your order…' : 'Confirm your order status'}</h2>
        <p>{busy ? 'Please wait for your confirmation.' : 'Your previous request may have reached us. Retry that same order before starting another.'}</p>
        <button className="place-order-btn" disabled={busy} onClick={submit}>{busy ? 'Please wait…' : 'Retry order'}</button>
      </section> : !cart ? (!cartError && <p role="status">Loading your cart…</p>) : !items.length ?
        <section className="empty-checkout"><h2>Your cart is empty</h2><Link to="/shop">Continue shopping</Link></section> :
        <form onSubmit={submit} aria-busy={busy}><div className="checkout-grid">
          <div className="checkout-left"><section className="checkout-card"><h2>Shipping Details</h2>
            <div className="form-grid">{fields.map(([name, label, autoComplete]) =>
              <div className={`input-group${name === 'address' ? ' full-width' : ''}`} key={name}>
                <label htmlFor={`shipping-${name}`}>{label}</label>
                <input id={`shipping-${name}`} name={name} type={name === 'email' ? 'email' : name === 'phone' ? 'tel' : 'text'}
                  autoComplete={autoComplete} required maxLength={200} value={form[name]} disabled={busy}
                  onChange={event => setForm(previous => ({ ...previous, [name]: event.target.value }))} />
              </div>)}
            </div></section>
            <section className="checkout-card payment-card"><h2>Payment Method</h2>
              <div className="payment-option active-payment"><div><Banknote size={22} /><span>Cash on delivery</span></div></div>
              <p>Pay when your order arrives.</p>
            </section>
          </div>
          <aside className="checkout-summary"><h2>Order Summary</h2>
            <div className="summary-products">{items.map(item => <div className="summary-product" key={`${item.productId}-${item.size}-${item.color}`}>
              <img src={item.image} alt={item.name} /><div className="summary-product-info"><h3>{item.name}</h3>
                <p>{item.size} / {item.color} · Qty: {item.quantity}</p></div><strong>{money(item.price * item.quantity)}</strong>
            </div>)}</div><div className="summary-divider" />
            {[['Subtotal', totals?.subtotal], ['Discount', totals ? -totals.discount : undefined], ['Delivery Fee', totals?.deliveryFee], ['Total', totals?.total]].map(([label, value]) =>
              <div className={`summary-row${label === 'Total' ? ' total-row' : ''}`} key={label}><span>{label}</span><strong>{value === undefined ? '—' : money(value)}</strong></div>)}
            {cart.message && <p role="alert">{cart.message} <Link to="/cart">Review cart</Link></p>}
            <button type="submit" className="place-order-btn" disabled={busy || !totals}><span>Place Order</span><ArrowRight size={22} /></button>
          </aside>
        </div></form>}
    </>}
  </div></main></>;
}
