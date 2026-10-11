import React, { useMemo, useRef, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { CheckoutElementsProvider, PaymentElement, useCheckoutElements } from '@stripe/react-stripe-js/checkout';

// Publishable test keys are designed for browser use; secret keys stay on the API.
const stripe = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_51RBzsvFRqFM1VTQafRTXmOMy70tRHeYFbsReUsxNelHU3KLRd1VTu8W2AoZY62BO5MpCX5ycjFnCXGtBdmMIFDby00FStcVeCp');

function PaymentForm({ onBusy }) {
  const state = useCheckoutElements();
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const submitting = useRef(false);
  if (state.type === 'loading') return <p role="status">Loading secure payment form…</p>;
  if (state.type === 'error') return <p role="alert">{state.error.message}</p>;
  const { checkout } = state;
  async function pay(event) {
    event.preventDefault();
    if (submitting.current) return;
    submitting.current = true; setBusy(true); onBusy(true); setError('');
    try {
      const result = await checkout.confirm();
      if (result.type === 'error') setError(result.error.message);
    } catch (e) { setError(e.message || 'Payment could not be confirmed. Please retry.'); }
    finally { submitting.current = false; setBusy(false); onBusy(false); }
  }
  return <form onSubmit={pay} aria-busy={busy}>
    <PaymentElement options={{ wallets: { link: 'never' }, fields: { billingDetails: { name: 'always' } } }} />
    {error && <p role="alert">{error}</p>}
    <button className="place-order-btn" disabled={busy} style={{marginTop:20}}>{busy ? 'Processing payment…' : `Pay ${checkout.total.total.amount}`}</button>
  </form>;
}
export default function StripePayment({ clientSecret, customerName, onBusy }) {
  const options = useMemo(() => ({ clientSecret, defaultValues: { billingAddress: { name: customerName } }, elementsOptions: { appearance: { theme:'stripe',variables:{colorPrimary:'#000000',borderRadius:'12px'} } } }), [clientSecret, customerName]);
  return <CheckoutElementsProvider stripe={stripe} options={options}>
    <PaymentForm onBusy={onBusy} />
  </CheckoutElementsProvider>;
}
