import React, { useState } from 'react';
import { api, getAuthToken } from '../api';

export const reviewKey = review => JSON.stringify([review.order, review.product, review.size || '', review.color || '']);

export default function OrderProductRating({ orderId, productId, size, color, review, onSaved, onUnauthorized }) {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(review?.rating || 5);
  const [comment, setComment] = useState(review?.comment || '');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);
  async function submit(event) {
    event.preventDefault();
    if (busy) return;
    setBusy(true); setError(''); setSaved(false);
    try {
      const result = await api(`/products/${productId}/reviews`, { method: 'POST', headers: { Authorization: `Bearer ${getAuthToken()}` }, body: { rating, comment, orderId, size: size || '', color: color || '' } });
      onSaved({ ...result.data, product: productId });
      setSaved(true); setOpen(false);
    } catch (error) {
      if (error.status === 401) onUnauthorized(error);
      else setError(error.message);
    } finally { setBusy(false); }
  }
  return <div className="order-product-rating">
    {!open && <button type="button" className="order-rate-toggle" onClick={() => { setRating(review?.rating || 5); setComment(review?.comment || ''); setOpen(true); setSaved(false); }}>{review ? `Your rating: ${review.rating}/5 · Edit rating` : 'Rate this product'}</button>}
    {saved && <p role="status" className="order-rating-success">Thank you! Your rating has been saved.</p>}
    {open && <form onSubmit={submit}>
      <p>Rating this order’s {size || 'standard size'} / {color || 'standard color'} variant.</p>
      <fieldset disabled={busy}><legend>Your rating</legend><div className="order-rating-stars">
        {[1, 2, 3, 4, 5].map(value => <label key={value} className={value <= rating ? 'is-selected' : ''}><input type="radio" name="rating" value={value} checked={rating === value} onChange={() => setRating(value)} aria-label={`${value} ${value === 1 ? 'star' : 'stars'}`} /><span aria-hidden="true">★</span></label>)}
      </div><label className="order-rating-comment">Review (optional)<textarea rows={3} maxLength={2000} value={comment} onChange={event => setComment(event.target.value)} placeholder="How was this product?" /></label></fieldset>
      <div className="order-rating-actions"><button type="submit" disabled={busy}>{busy ? 'Saving…' : 'Save rating'}</button><button type="button" disabled={busy} onClick={() => { setOpen(false); setError(''); }}>Cancel</button></div>
    </form>}
    {error && <p role="alert" className="order-rating-error">{error}</p>}
  </div>;
}
