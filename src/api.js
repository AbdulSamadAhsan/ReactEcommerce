export const API_URL = (import.meta.env.VITE_API_URL || 'https://shopco-api-psi.vercel.app/api').replace(/\/$/, '');
export const getAuthToken = () => localStorage.getItem('shopco.authToken');
export const getCurrentUser = () => { try { return JSON.parse(localStorage.getItem('shopco.user') || 'null'); } catch { return null; } };
export const logout = () => { localStorage.removeItem('shopco.authToken'); localStorage.removeItem('shopco.user'); window.dispatchEvent(new Event('shopco:auth')); };
export async function login(credentials) {
  const result = await api('/auth/login', { method: 'POST', body: credentials });
  localStorage.setItem('shopco.authToken', result.data.token); localStorage.setItem('shopco.user', JSON.stringify(result.data.user));
  console.log(result.data);
 
 
  window.dispatchEvent(new Event('shopco:auth')); return result.data;
}
export async function pay(data){
      const result=await api("/pay",{method:"POST",body:data})
      console.log('POST /api/pay response:', result.data);
      return result.data;
}
export async function register(credentials) {
  const result = await api('/auth/register', { method: 'POST', body: credentials });
  localStorage.setItem('shopco.authToken', result.data.token); localStorage.setItem('shopco.user', JSON.stringify(result.data.user));
  window.dispatchEvent(new Event('shopco:auth')); return result.data;
}
export async function api(path, { body, headers, ...options } = {}) {
  const timeout = AbortSignal.timeout(20000);
  const response = await fetch(API_URL + path, { ...options, signal: options.signal ? AbortSignal.any([options.signal, timeout]) : timeout, headers: { ...(body !== undefined && { 'Content-Type': 'application/json' }), ...headers }, ...(body !== undefined && { body: JSON.stringify(body) }) });
  const result = await response.json();
  if (!response.ok) throw Object.assign(new Error(result.message || 'Unable to load data. Please try again.'), { status: response.status });
  return result;
}
function cartHeaders() {
  let token = localStorage.getItem('shopco.cartToken');
  if (!/^[a-f0-9]{64}$/.test(token || '')) {
    const previous = localStorage.getItem('cart');
    if (previous && !localStorage.getItem('shopco.legacyCart')) localStorage.setItem('shopco.legacyCart', previous);
    token = Array.from(crypto.getRandomValues(new Uint8Array(32)), n => n.toString(16).padStart(2, '0')).join('');
    localStorage.setItem('shopco.cartToken', token);
  }
  return { 'X-Cart-Token': token };
}
function cacheCart(cart) {
  // Compatibility cache for checkout; MongoDB remains the source of truth.
  localStorage.setItem('cart', JSON.stringify(cart.items.map(item => ({ ...item, _id: item.productId }))));
  localStorage.setItem('shopco.cartTotals', JSON.stringify(cart.totals));
  window.dispatchEvent(new Event('shopco:cart'));
  return cart;
}
export async function getCart(signal) {
  return cacheCart((await api('/guest-cart', { headers: cartHeaders(), signal })).data);
}
export const cartLine = ({ productId, quantity, size, color }) => ({ productId, quantity, size, color });
export async function saveCart(cart, items, promoCode = cart.promoCode) {
  return cacheCart((await api('/guest-cart', { method: 'PUT', headers: cartHeaders(), body: { items: items.map(cartLine), revision: cart.revision, promoCode } })).data);
}
export async function addCartItem(line) {
  const cart = await getCart();
  const items = cart.items.map(cartLine);
  const match = items.find(i => i.productId === line.productId && i.size === line.size && i.color === line.color);
  if (match) match.quantity += line.quantity;
  else items.push(line);
  return saveCart(cart, items);
}
