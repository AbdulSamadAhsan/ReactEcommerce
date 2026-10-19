import React, { useState } from 'react';
import ProductCard from './ProductCard';
import { api } from '../api';

export default function ProductSection({ id, title, sort, products }) {
  const [allProducts, setAllProducts] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function toggleProducts() {
    if (busy) return;
    if (expanded) { setExpanded(false); return; }
    if (allProducts) { setExpanded(true); return; }
    setBusy(true);
    setError('');
    try {
      const result = await api(`/products?sort=${sort}&limit=100&page=1`);
      const items = [...result.data];
      for (let page = 2; page <= (result.pagination?.pages || 1); page += 1) {
        const next = await api(`/products?sort=${sort}&limit=100&page=${page}`);
        items.push(...next.data);
      }
      setAllProducts([...new Map(items.map(item => [item._id, item])).values()]);
      setExpanded(true);
    } catch (error) {
      setError(error.message || 'Unable to load products. Please try again.');
    } finally {
      setBusy(false);
    }
  }

  return <section id={id} className="shell product-section">
    <h2>{title}</h2>
    <div id={`${id}-products`} className="product-grid" aria-busy={busy}>
      {(expanded ? allProducts : products).map(item => <ProductCard key={item._id} item={item} />)}
    </div>
    {error && <p role="alert">{error}</p>}
    <button type="button" className="outline-btn" onClick={toggleProducts}
      disabled={busy} aria-expanded={expanded} aria-controls={`${id}-products`}
      aria-label={`${expanded ? 'Show fewer' : 'View all'} ${title.toLowerCase()}`}>
      {busy ? 'Loading…' : expanded ? 'Show Less' : 'View All'}
    </button>
  </section>;
}
