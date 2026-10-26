import React, { useEffect, useRef, useState } from 'react';
import { useCurrency } from '../CurrencyContext';
import { formatMoney } from '../currency';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowLeftRight, LoaderCircle } from 'lucide-react';
import Header from './Header';
import StripePayment from './StripePayment';
import { cartLine, createOrder, getCart, getCurrentUser, logout, saveCart, startStripeCheckout, getStripeCheckout, cancelStripeCheckout } from '../api';
import './Checkout.css';

const fields = [
  ['firstName', 'First Name', 'given-name'], ['lastName', 'Last Name', 'family-name'],
  ['email', 'Email Address', 'email'], ['phone', 'Mobile number', 'tel'],
  ['address', 'Street Address', 'street-address'],
  ['state', 'State / Province', 'address-level1'], ['zip', 'ZIP / Postal Code', 'postal-code'],
];
const orderDateTime = value => value && Number.isFinite(Date.parse(value))
  ? new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value))
  : null;
function readAttempt(key) {
  try { return JSON.parse(sessionStorage.getItem(key) || 'null'); } catch { return null; }
}

export default function Checkout() {
  const { currency: storeCurrency, exchangeRate } = useCurrency();
  const navigate = useNavigate();
  const user = getCurrentUser();
  const storageKey = `shopco.checkout.${user?._id || 'guest'}`;
  const [attempt, setAttempt] = useState(() => readAttempt(storageKey));
  const [form, setForm] = useState(() => {
    const saved = readAttempt(storageKey);
    return saved?.body?.shipping || Object.fromEntries(fields.map(([name]) => [name,
      user?.[name] || (name === 'firstName' ? user?.name?.trim().split(/\s+/)[0] : name === 'lastName' ? user?.name?.trim().split(/\s+/).slice(1).join(' ') : '') || '',
    ]));
  });
  const [paymentMethod, setPaymentMethod] = useState(() => readAttempt(storageKey)?.body?.paymentMethod || 'cash_on_delivery');
  const [stripePayment, setStripePayment] = useState(null);
  const [paying, setPaying] = useState(false);
  const [checkingPayment, setCheckingPayment] = useState(false);
  const returnSession = new URLSearchParams(window.location.search).get('session_id');
  const cancelled = new URLSearchParams(window.location.search).get('payment') === 'cancelled';
  const checkedSession = useRef(null);
  const [cart, setCart] = useState(null);
  const [cartError, setCartError] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState(() => readAttempt(storageKey)?.notice || '');
  const [busy, setBusy] = useState(false);
  const [refresh, setRefresh] = useState(0);
  const submitting = useRef(false);
  const order = attempt?.order;
  const submittedRevision = attempt?.revision;

  useEffect(() => {
    // A Stripe return must finish verifying its original payment. Otherwise,
    // reconcile a saved confirmation with the current server-side cart.
    if (order && returnSession) return;
    const controller = new AbortController();
    setCartError('');
    getCart(controller.signal).then(currentCart => {
      if (controller.signal.aborted) return;
      setCart(currentCart);
      if (order && currentCart.items.length > 0 &&
          submittedRevision !== undefined && currentCart.revision !== submittedRevision) {
        // Only retire a completed attempt. Pending/uncertain requests retain
        // their idempotency key, and an uncleared submitted cart stays protected.
        sessionStorage.removeItem(storageKey);
        setAttempt(null);
        setNotice('');
        setStripePayment(null);
        setError('');
      }
    }).catch(e => {
      if (e.name !== 'AbortError') setCartError(e.message);
    });
    return () => controller.abort();
  }, [refresh, order, returnSession, submittedRevision, storageKey, storeCurrency, exchangeRate]);

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
            paymentMethod,
            currency: cart.totals.currency || 'USD',
            exchangeRate: cart.totals.exchangeRate || 1,
            ...(paymentMethod === 'stripe' && { checkoutUi: 'elements' }),
          },
        };
        // Persist before sending so an uncertain response can be retried after a reload.
        sessionStorage.setItem(storageKey, JSON.stringify(current));
        setAttempt(current);
      }
      if (current.body.paymentMethod === 'stripe') {
        const result = await startStripeCheckout(current.body, current.key);
        if (result.paid) { await completeOrder(current, result.order); return; }
        const pending = { ...current, stripeSessionId: result.sessionId };
        sessionStorage.setItem(storageKey, JSON.stringify(pending)); setAttempt(pending);
        if (result.clientSecret) { setStripePayment(result); return; }
        const destination = new URL(result.url);
        if (destination.protocol !== 'https:' || destination.hostname !== 'checkout.stripe.com') throw new Error('Invalid Stripe checkout URL');
        window.location.assign(destination.href);
        return;
      }
      const placed = await createOrder(current.body, current.key);
      await completeOrder(current, placed);
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


  async function completeOrder(current, placed) {
      const completed = { ...current, order: placed };
      setAttempt(completed);
      try { sessionStorage.setItem(storageKey, JSON.stringify(completed)); } catch { /* Keep confirmation in memory. */ }
      if (current.order?._id === placed._id) return;
      try {
        // Use the submitted revision so changes made in another tab are never erased.
        await saveCart({ revision: current.revision }, [], '');
      } catch {
        const warning = 'Your order is confirmed, but your cart could not be cleared. Review your cart before ordering again.';
        setNotice(warning);
        try { sessionStorage.setItem(storageKey, JSON.stringify({ ...completed, notice: warning })); } catch { /* Keep confirmation in memory. */ }
      }
  }

  async function cancelPayment() {
    if (submitting.current || !attempt?.stripeSessionId) return;
    submitting.current = true; setBusy(true); setError('');
    try {
      const result = await cancelStripeCheckout(attempt.stripeSessionId);
      if (result.paid) { await completeOrder(attempt, result.order); return; }
      if (result.status !== 'expired') throw new Error('Payment cannot be cancelled yet. Check its status again.');
      sessionStorage.removeItem(storageKey); setAttempt(null); setNotice(''); setStripePayment(null);
      navigate('/checkout', {replace:true}); setRefresh(n => n + 1);
    } catch(e) { setError(e.message); }
    finally { submitting.current = false; setBusy(false); }
  }

  async function checkPayment() {
    if (!returnSession) return;
    setCheckingPayment(true); setError('');
    try {
      const result = await getStripeCheckout(returnSession);
      if (result.paid) {
        const current = readAttempt(storageKey);
        // Only clear this browser's cart if it belongs to this payment attempt.
        if (current?.stripeSessionId === returnSession) await completeOrder(current, result.order);
        else setAttempt({ order: result.order });
      } else if (result.status === 'expired') {
        sessionStorage.removeItem(storageKey); setAttempt(null);
        setError('This payment session expired. Your card was not charged. Start checkout again.');
        navigate('/checkout', {replace:true}); setRefresh(n => n + 1);
      } else setError('Payment has not completed. You can resume payment or check its status again.');
    } catch(e) {
      if (e.status === 401) { logout(); navigate('/login', {state:{from:'/checkout?session_id='+encodeURIComponent(returnSession)},replace:true}); }
      else setError(e.message || 'Unable to check payment. Please retry.');
    } finally { setCheckingPayment(false); }
  }
  useEffect(() => {
    if (!returnSession || checkedSession.current === returnSession) return;
    checkedSession.current = returnSession;
    checkPayment();
  }, [returnSession]);

  const items = cart?.items || [];
  const totals = cart?.totals;
  const money = value => formatMoney(value, order?.currency || totals?.currency || 'USD');
  return <><Header /><main className="checkout-page"><div className="checkout-container">
    <div className="checkout-breadcrumb"><Link to="/">Home</Link><span>Checkout</span></div>
    <h1 className="checkout-title">{order ? 'ORDER CONFIRMED' : 'CHECKOUT'}</h1>
    {!user && !order && <p>Checking out as a guest. No account required. <Link to="/login" state={{ from: '/checkout' }}>Log in</Link> if you already have an account.</p>}
    {order ? <section className="checkout-card" role="status">
      <h2>Thank you for your order</h2>
      <p>Order number: <strong>{order._id}</strong></p>
      <p>Order date &amp; time: <strong>{orderDateTime(order.createdAt) ? <time dateTime={order.createdAt}>{orderDateTime(order.createdAt)}</time> : 'Unavailable'}</strong></p>
      <p>Total: <strong>{money(order.total)} {order.currency}</strong></p>
      <p>Payment: {order.paymentMethod === 'stripe' ? 'Stripe card — paid' : 'Cash on delivery'}. Your order is {order.status}.</p>
      {notice && <p role="alert">{notice}</p>}
      <Link to="/shop" onClick={() => sessionStorage.removeItem(storageKey)}>Continue shopping</Link>
    </section> : <>
      {cartError && <p role="alert">{cartError} <button type="button" onClick={() => setRefresh(n => n + 1)}>Refresh cart</button></p>}
      {error && <p role="alert">{error}</p>}
      {cancelled && <p role="status">Payment was cancelled. Your cart is saved. Resume the same checkout below.</p>}
      {returnSession && !order && <button type="button" disabled={checkingPayment} onClick={checkPayment}>{checkingPayment ? 'Checking payment…' : 'Check payment status'}</button>}
      {stripePayment ? <section className="checkout-card" style={{maxWidth:560,margin:'0 auto'}}>
        <h2>Secure card payment</h2><p>No real payment will be collected.</p>
        <StripePayment key={stripePayment.sessionId} {...stripePayment} onBusy={setPaying} />
        <button type="button" className="payment-change-btn" disabled={busy || paying} onClick={cancelPayment}>{busy ? <LoaderCircle className="payment-change-spinner" size={18} aria-hidden="true" /> : <ArrowLeftRight size={18} aria-hidden="true" />}<span>{busy ? 'Cancelling payment…' : 'Cancel payment and change payment method'}</span></button>
      </section> : attempt ? <section className="checkout-card">
        <h2>{busy ? 'Please wait…' : attempt.body?.paymentMethod === 'stripe' ? 'Complete your payment' : 'Confirm your order status'}</h2>
        <p>{busy ? 'Please wait for your confirmation.' : attempt.body?.paymentMethod === 'stripe' ? 'Resume this checkout securely on Stripe. No real payment will be collected.' : 'Your previous request may have reached us. Retry that same order before starting another.'}</p>
        <button className="place-order-btn" disabled={busy} onClick={submit}>{busy ? 'Please wait…' : attempt.body?.paymentMethod === 'stripe' ? 'Continue to payment' : 'Retry order'}</button>
        {attempt.stripeSessionId && <button type="button" className="payment-change-btn" disabled={busy} onClick={cancelPayment}>{busy ? <LoaderCircle className="payment-change-spinner" size={18} aria-hidden="true" /> : <ArrowLeftRight size={18} aria-hidden="true" />}<span>{busy ? 'Cancelling payment…' : 'Cancel payment and change payment method'}</span></button>}
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
              <label className="payment-option"><span>Cash on delivery</span><input type="radio" name="paymentMethod" value="cash_on_delivery" checked={paymentMethod === 'cash_on_delivery'} onChange={e => setPaymentMethod(e.target.value)} /></label>
              <label className="payment-option"><span>Card via Stripe</span><input type="radio" name="paymentMethod" value="stripe" checked={paymentMethod === 'stripe'} onChange={e => setPaymentMethod(e.target.value)} /></label>
              <p>{paymentMethod === 'stripe' ? 'No real payment will be collected.' : 'Pay when your order arrives.'}</p>
            </section>
          </div>
          <aside className="checkout-summary"><h2>Order Summary</h2>
            <div className="summary-products">{items.map(item => <div className="summary-product" key={`${item.productId}-${item.size}-${item.color}`}>
              <img src={item.image} alt={item.name} /><div className="summary-product-info"><h3>{item.name}</h3>
                <p>{item.size} / {item.color} · Qty: {item.quantity}</p></div><strong>{money(item.price * item.quantity)}</strong>
            </div>)}</div><div className="summary-divider" />
            {[['Subtotal', totals?.subtotal], ['Discount', totals ? -totals.discount : undefined], ['GST (16%)', totals?.gst], ['Delivery Fee', totals?.deliveryFee], ['Total', totals?.total]].map(([label, value]) =>
              <div className={`summary-row${label === 'Total' ? ' total-row' : ''}`} key={label}><span>{label}</span><strong>{value === undefined ? '—' : money(value)}</strong></div>)}
            {cart.message && <p role="alert">{cart.message} <Link to="/cart">Review cart</Link></p>}
            <button type="submit" className="place-order-btn" disabled={busy || !totals}><span>{paymentMethod === 'stripe' ? 'Continue to payment' : 'Place Order'}</span><ArrowRight size={22} /></button>
          </aside>
        </div></form>}
    </>}
  </div></main></>;
}
