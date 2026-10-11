import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api, getAuthToken, logout } from '../api';
import Header from './Header';
import Footer from './Footer';

export default function Account() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    const options = { signal: controller.signal, headers: { Authorization: `Bearer ${getAuthToken()}` } };
    setError('');
    Promise.all([api('/auth/me', options), api('/orders', options)])
      .then(([user, orders]) => setData({user:user.data, orders:orders.data}))
      .catch(error => {
        if (error.name === 'AbortError') return;
        if (error.status === 401) { logout(); navigate('/login', {replace:true, state:{from:'/account'}}); }
        else setError(error.message);
      });
    return () => controller.abort();
  }, [retry, navigate]);
  return <><Header /><main className="shell" style={{padding:'40px 20px'}}><h1>My account</h1>
    {error && <p role="alert">{error} <button onClick={() => setRetry(n => n + 1)}>Try again</button></p>}
    {!data && !error && <p role="status">Loading account…</p>}
    {data && <><h2>{data.user.name}</h2><p>{data.user.email}</p><p>Mobile: {data.user.phone || 'Not provided'}</p>
      <h2>Your orders</h2>{!data.orders.length ? <p>No orders yet. <Link to="/shop">Start shopping</Link></p> : data.orders.map(order =>
        <section key={order._id} style={{borderBottom:'1px solid #ddd',padding:'16px 0'}}>
          <h3>Order {order._id}</h3><p>{order.status.replaceAll('_',' ')} · {order.paymentMethod === 'stripe' ? 'Stripe test card' : 'Cash on delivery'} · {order.paymentStatus}</p>
          <p>{order.items.map(item => `${item.name} × ${item.quantity}`).join(', ')}</p><strong>${Number(order.total).toFixed(2)} {order.currency}</strong>
        </section>)}
    </>}
  </main><Footer /></>;
}
