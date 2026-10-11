import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Package, ArrowRight, RefreshCw, UserRound } from 'lucide-react';
import { api, getAuthToken, logout } from '../api';
import Header from './Header';
import Footer from './Footer';
import './Account.css';

const isPast = order => ['delivered', 'cancelled'].includes(order.status);
const labels = {awaiting_payment:'Awaiting payment',pending:'Order received',processing:'Preparing your order',shipped:'On the way',delivered:'Delivered',cancelled:'Cancelled'};
const money = (value,currency='USD') => new Intl.NumberFormat('en-US',{style:'currency',currency}).format(Number(value||0));
const date = value => value && !Number.isNaN(Date.parse(value)) ? new Date(value).toLocaleDateString(undefined,{year:'numeric',month:'short',day:'numeric'}) : 'Date unavailable';
const paymentLabel = order => order.paymentStatus==='paid'?'Paid':order.paymentStatus==='expired'?'Payment expired':order.status==='cancelled'?'Not charged':order.paymentMethod==='cash_on_delivery'?'Pay on delivery':'Payment pending';

function OrderCard({order}) {
  const currency=order.currency||'USD', stages=['pending','processing','shipped','delivered'];
  const stage=stages.indexOf(order.status);
  const gstLabel = order.gstRate ? `GST (${Number((order.gstRate * 100).toFixed(2))}%)` : 'GST';
  return <article className="account-order">
    <div className="account-order-top"><div><span className="account-eyebrow">Order number</span><h3>#{order._id}</h3><p>Placed {date(order.createdAt)}</p></div><span className={`account-badge account-badge-${order.status}`}>{labels[order.status]||'Order in progress'}</span></div>
    {!isPast(order)&&stage>=0&&<ol className="account-progress" aria-label="Order progress">{stages.map((step,index)=><li key={step} className={index<=stage?'is-complete':''} aria-current={index===stage?'step':undefined}><span aria-hidden="true"/>{['Received','Preparing','Shipped','Delivered'][index]}</li>)}</ol>}
    {order.status==='awaiting_payment'&&<p className="account-payment-note">Waiting for payment confirmation. If you have just paid, refresh your orders to check the latest status.</p>}
    <ul className="account-items">{order.items.map((item,index)=><li key={`${item.productId}-${index}`}>
      {item.image?<img src={item.image} alt={item.name} loading="lazy"/>:<span className="account-image-placeholder"><Package aria-hidden="true"/></span>}
      <div><Link to={'/products/'+item.productId}>{item.name}</Link><p>Size: {item.size} · Quantity: {item.quantity}</p><p className="account-color">Color: <span style={{background:item.color}} aria-hidden="true"/>{item.color}</p></div><strong>{money(item.price*item.quantity,currency)}</strong>
    </li>)}</ul>
    <div className="account-order-bottom"><div><span className="account-eyebrow">{order.paymentMethod==='stripe'?'Card via Stripe':'Cash on delivery'}</span><p>{paymentLabel(order)}</p></div><div className="account-total"><span className="account-eyebrow">Order total</span><strong>{money(order.total,currency)}</strong></div></div>
    <details className="account-details"><summary>Shipping & order details</summary><div className="account-detail-grid"><div><h4>Delivery address</h4><p>{[order.shipping?.firstName,order.shipping?.lastName].filter(Boolean).join(' ')}</p><p>{order.shipping?.address}</p><p>{[order.shipping?.city,order.shipping?.state,order.shipping?.zip,order.shipping?.country].filter(Boolean).join(', ')}</p><p>{order.shipping?.phone}</p></div><dl>{[['Subtotal',order.subtotal],['Discount',-Number(order.discount||0)],[gstLabel,order.gst ?? 0],['Delivery',order.deliveryFee],['Total',order.total]].map(([label,value])=><div key={label}><dt>{label}</dt><dd>{money(value,currency)}</dd></div>)}</dl></div></details>
  </article>;
}

export default function Account() {
  const navigate=useNavigate();
  const [data,setData]=useState(null),[error,setError]=useState(''),[retry,setRetry]=useState(0);
  const [loading,setLoading]=useState(true),[loadingMore,setLoadingMore]=useState(false),[hasMore,setHasMore]=useState(false);
  const [filter,setFilter]=useState('current'),[search,setSearch]=useState('');
  function handleError(error) {
    if(error.name==='AbortError')return;
    if(error.status===401){logout();navigate('/login',{replace:true,state:{from:'/account'}});}
    else setError(error.message);
  }
  useEffect(()=>{
    const controller=new AbortController();
    const options={signal:controller.signal,headers:{Authorization:`Bearer ${getAuthToken()}`}};
    setError('');setLoading(true);
    Promise.all([api('/auth/me',options),api('/orders',options)])
      .then(([user,orders])=>{setData({user:user.data,orders:orders.data});setHasMore(orders.data.length===100);})
      .catch(handleError).finally(()=>{if(!controller.signal.aborted)setLoading(false);});
    return ()=>controller.abort();
  },[retry,navigate]);
  async function loadMore(){
    setLoadingMore(true);setError('');
    try{
      const result=await api('/orders?before='+encodeURIComponent(data.orders.at(-1)._id),{headers:{Authorization:`Bearer ${getAuthToken()}`}});
      setData(previous=>({...previous,orders:[...previous.orders,...result.data.filter(order=>!previous.orders.some(existing=>existing._id===order._id))]}));setHasMore(result.data.length===100);
    }catch(error){handleError(error);}finally{setLoadingMore(false);}
  }
  const orders=data?.orders||[];
  const visible=orders.filter(order=>(filter==='all'||(filter==='past')===isPast(order))&&(!search.trim()||[order._id,...order.items.map(item=>item.name)].join(' ').toLowerCase().includes(search.trim().toLowerCase())));
  return <><Header/><main className="shell account-page">
    <nav className="account-breadcrumb" aria-label="Breadcrumb"><Link to="/">Home</Link><span>/</span><span>My account</span></nav>
    <div className="account-heading"><div><h1>MY ACCOUNT</h1><p>Your details. Your orders. All in one place.</p></div><Link className="account-shop-link" to="/shop">Continue shopping <ArrowRight size={18}/></Link></div>
    {error&&<div className="account-error" role="alert">{error} <button onClick={()=>setRetry(n=>n+1)} disabled={loading}>Try again</button></div>}
    {!data&&loading&&<p role="status">Loading your account and orders…</p>}
    {data&&<div className="account-layout"><aside className="account-profile"><span className="account-avatar"><UserRound size={30} aria-hidden="true"/></span><h2>{data.user.name}</h2><p>Account details</p><dl><dt>Email address</dt><dd>{data.user.email}</dd><dt>Mobile number</dt><dd>{data.user.phone||'Not provided'}</dd></dl><Link to="/shop">Find your next favorite <ArrowRight size={16}/></Link></aside>
      <section className="account-orders" aria-labelledby="orders-heading" aria-busy={loading||loadingMore}>
        <div className="account-orders-heading"><h2 id="orders-heading">Your orders</h2><button className="account-refresh" onClick={()=>setRetry(n=>n+1)} disabled={loading||loadingMore}><RefreshCw size={16} aria-hidden="true"/>{loading?'Refreshing…':'Refresh'}</button></div>
        <div className="account-filters" role="group" aria-label="Filter orders">{[['current','Current orders'],['past','Past orders'],['all','All orders']].map(([value,label])=><button key={value} aria-pressed={filter===value} className={filter===value?'is-active':''} onClick={()=>setFilter(value)}>{label}</button>)}</div>
        {!!orders.length&&<input className="account-search" type="search" aria-label="Search orders" placeholder="Search by order number or product" value={search} onChange={event=>setSearch(event.target.value)}/>}
        <p className="account-results" role="status">{visible.length} {visible.length===1?'order':'orders'}{hasMore?' in loaded history':''}</p>
        {visible.length?<div className="account-order-list">{visible.map(order=><OrderCard key={order._id} order={order}/>)}</div>:<div className="account-empty"><Package size={38} aria-hidden="true"/><h3>{search?'No matching orders':filter==='past'?'No past orders yet':filter==='current'?'No current orders':'No orders yet'}</h3><p>{search?'Try a different product name or order number.':filter==='past'?'Delivered and cancelled orders will appear here.':'Your next order will appear here once you check out.'}</p><Link to="/shop">Explore the shop <ArrowRight size={17}/></Link></div>}
        {hasMore&&<button className="account-load-more" disabled={loading||loadingMore} onClick={loadMore}>{loadingMore?'Loading…':'Load older orders'}</button>}
      </section></div>}
  </main><Footer/></>;
}
