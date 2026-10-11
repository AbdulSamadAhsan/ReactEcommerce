import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import Header from './Header';
import Footer from './Footer';

export default function Brands() {
  const [brands, setBrands] = useState(null);
  const [error, setError] = useState('');
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    const controller = new AbortController(); setError('');
    api('/products/brands', {signal:controller.signal}).then(result => setBrands(result.data))
      .catch(error => { if(error.name !== 'AbortError') setError(error.message); });
    return () => controller.abort();
  }, [retry]);
  return <><Header /><main className="shell" style={{padding:'40px 20px'}}><h1>Shop by brand</h1>
    {error && <p role="alert">{error} <button onClick={() => setRetry(n => n + 1)}>Try again</button></p>}
    {!brands && !error && <p role="status">Loading brands…</p>}
    {brands && <ul>{brands.filter(Boolean).map(brand => <li key={brand} style={{padding:'12px 0'}}><Link to={'/shop?brand='+encodeURIComponent(brand)}>{brand}</Link></li>)}</ul>}
  </main><Footer /></>;
}
