import { hasDiscount } from '../discount';
import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Minus, Plus, ChevronRight, ArrowLeft } from 'lucide-react';
import { api, addCartItem } from '../api';
import Header from './Header';
import Footer from './Footer';
import Rating from './Rating';
import './productdetail.css';

const reviewDate = value => value && Number.isFinite(Date.parse(value))
  ? new Date(value).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
  : 'Date unavailable';

function ReviewCard({ review }) {
  const hasVariant = typeof review.size === 'string' || typeof review.color === 'string';
  return <article>
    <Rating value={review.rating} />
    <h3>{review.name}</h3>
    {hasVariant ? <div className="review-variant" aria-label="Rated product variant">
      <span>Size: <strong>{review.size || 'Standard'}</strong></span>
      <span>Color: {/^#[0-9a-f]{3,8}$/i.test(review.color || '') && <i style={{ backgroundColor: review.color }} aria-hidden="true" />}<strong>{review.color || 'Standard'}</strong></span>
    </div> : <p className="review-variant-unknown">Variant details unavailable for this earlier review.</p>}
    {review.comment && <p>{review.comment}</p>}
    <b>Rated on <time dateTime={review.createdAt}>{reviewDate(review.createdAt)}</time></b>
    {review.updatedAt && review.createdAt && new Date(review.updatedAt).getTime() > new Date(review.createdAt).getTime() && <small className="review-updated">Updated on <time dateTime={review.updatedAt}>{reviewDate(review.updatedAt)}</time></small>}
  </article>;
}

export default function ProductDetail() {
  const navigate = useNavigate();
  const goBack = () => { if (window.history.state?.idx > 0) navigate(-1); else navigate("/shop", { replace: true }); };
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [retry, setRetry] = useState(0);
  const [image, setImage] = useState('');
  const [size, setSize] = useState('');
  const [color, setColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [tab, setTab] = useState('details');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [cartError, setCartError] = useState('');
  const [reviewsError, setReviewsError] = useState('');

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true); setError(''); setProduct(null); setMessage(''); setCartError(''); setRelated([]); setReviews([]); setReviewsError('');
    api(`/products/${encodeURIComponent(id)}`, { signal: controller.signal }).then(({ data }) => {
      setProduct(data); setImage(data.image); setSize(data.sizes[0] || ''); setColor(data.colors[0] || ''); setQuantity(1);
      api('/products?' + new URLSearchParams({ category: data.category, limit: 5 }), { signal: controller.signal })
        .then(r => setRelated(r.data.filter(p => p._id !== id).slice(0, 4))).catch(() => {});
    }).catch(e => { if (e.name !== 'AbortError') setError(e.status === 404 ? 'This product is no longer available.' : e.message); })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    api(`/products/${encodeURIComponent(id)}/reviews`, { signal: controller.signal }).then(r => setReviews(r.data))
      .catch(e => { if (e.name !== 'AbortError') setReviewsError('Reviews could not be loaded.'); });
    return () => controller.abort();
  }, [id, retry]);

  async function add() {
    setBusy(true); setMessage(''); setCartError('');
    try { await addCartItem({ productId: id, quantity, size, color }); setMessage('Added to your cart.'); }
    catch (e) { setCartError(e.message); }
    finally { setBusy(false); }
  }

  return <><Header /><main className="shell">
    <button type="button" className="product-back-button" onClick={goBack} aria-label="Go back to the previous page"><ArrowLeft size={18} aria-hidden="true" /><span>Back</span></button>
    <div className="crumb"><Link to="/">Home</Link><ChevronRight /><Link to="/shop">Shop</Link>{product && <><ChevronRight /><b>{product.category}</b></>}</div>
    {loading ? <p role="status" className="not-found">Loading product…</p> : error ? <div className="not-found" role="alert"><p>{error}</p><button onClick={() => setRetry(n => n + 1)}>Try again</button> <Link to="/shop">Back to shop</Link></div> : product && <>
      <section className="product">
        <div className="gallery"><div className="thumbs">{[...new Set([product.image, ...(product.images || [])])].map((src, index) =>
          <button key={src} className={image === src ? 'active' : ''} onClick={() => setImage(src)} aria-label={`View image ${index + 1}`}><img src={src} alt={`${product.name} view ${index + 1}`} /></button>)}</div>
          <div className="mainimg"><img src={image} alt={product.name} /></div></div>
        <div className="info"><h1>{product.name.toUpperCase()}</h1><Rating value={product.rating || 0} />
          <div className="price"><b>${product.price}</b>{product.oldPrice > product.price && <del>${product.oldPrice}</del>}{hasDiscount(product.discount) && <em>{product.discount}</em>}</div>
          <p>{product.description}</p><hr /><label>Select Colors</label>
          <div className="colors">{product.colors.map(value => <button key={value} style={{ backgroundColor: value }} className={color === value ? 'selected' : ''} aria-label={`Color ${value}`} aria-pressed={color === value} onClick={() => setColor(value)}>{color === value ? '✓' : ''}</button>)}</div>
          <hr /><label>Choose Size</label><div className="sizes">{product.sizes.map(value => <button key={value} className={size === value ? 'active' : ''} aria-pressed={size === value} onClick={() => setSize(value)}>{value}</button>)}</div>
          <hr /><p>{product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}</p>
          <div className="buy"><div className="qty"><button aria-label="Decrease quantity" disabled={busy || quantity <= 1} onClick={() => setQuantity(n => n - 1)}><Minus /></button><span aria-live="polite">{quantity}</span><button aria-label="Increase quantity" disabled={busy || quantity >= Math.min(20, product.stock)} onClick={() => setQuantity(n => n + 1)}><Plus /></button></div>
            <button className="add" disabled={busy || !product.stock || !size || !color} onClick={add}>{busy ? 'Adding…' : product.stock ? 'Add to Cart' : 'Out of stock'}</button></div>
          {cartError && <p role="alert">{cartError}</p>}{message && <p role="status">{message} <Link to="/cart"><u>View cart</u></Link></p>}
        </div>
      </section>
      <div className="tabs">{[['details', 'Product Details'], ['reviews', 'Rating & Reviews']].map(([key, label]) => <button key={key} className={tab === key ? 'active' : ''} onClick={() => setTab(key)}>{label}</button>)}</div>
      {tab === 'details' ? <div className="placeholder"><p>{product.description}</p><p>Brand: {product.brand} · Style: {product.style}</p></div> : <section className="reviews"><div className="review-head"><h2>All Reviews ({reviews.length})</h2></div>
        {reviewsError ? <p role="alert">{reviewsError}</p> : !reviews.length ? <p>No reviews yet.</p> : <div className="review-grid">{reviews.map(review => <ReviewCard key={review._id} review={review} />)}</div>}</section>}
      {!!related.length && <section className="related"><h2>YOU MIGHT ALSO LIKE</h2><div className="related-grid">{related.map(p => <article key={p._id}><Link to={`/products/${p._id}`}><div className="rimg"><img src={p.image} alt={p.name} /></div><h3>{p.name}</h3></Link><Rating value={p.rating} /><div className="rp"><b>${p.price}</b>{p.oldPrice > p.price && <del>${p.oldPrice}</del>}{hasDiscount(p.discount) && <em>{p.discount}</em>}</div></article>)}</div></section>}
    </>}
  </main><Footer /></>;
}

