import React, { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import { getAuthToken, login, register } from '../api';
import './Auth.css';

export function AuthPage({ mode = 'login' }) {
  const isRegister = mode === 'register';
  const location = useLocation(); const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState(''); const [busy, setBusy] = useState(false);
  if (getAuthToken()) return <Navigate to={location.state?.from || '/'} replace />;
  async function submit(e) {
    e.preventDefault(); setBusy(true); setError('');
    try { await (isRegister ? register(form) : login({ email: form.email, password: form.password })); navigate(location.state?.from || '/', { replace: true }); }
    catch (err) { setError(err.message); } finally { setBusy(false); }
  }
  return <><Header /><main className="auth-page"><section className="auth-card"><h1>{isRegister ? 'Create your account' : 'Welcome back'}</h1><p>{isRegister ? 'Register to save your details and continue to checkout.' : 'Log in to continue to checkout.'}</p>{error && <p className="auth-error" role="alert">{error}</p>}
    <form className="auth-form" onSubmit={submit}>{isRegister && <label>Full name<input required minLength="2" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} autoComplete="name" /></label>}<label>Email<input required type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} autoComplete="email" /></label><label>Password<input required minLength={isRegister ? 10 : 1} type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} autoComplete={isRegister ? 'new-password' : 'current-password'} /></label><button disabled={busy}>{busy ? 'Please wait…' : isRegister ? 'Create account' : 'Log in'}</button></form>
    <Link className="auth-link" to={isRegister ? '/login' : '/register'}>{isRegister ? 'Already have an account? Log in' : 'New to SHOP.CO? Create an account'}</Link>
  </section></main><Footer /></>;
}
export function Login() { return <AuthPage mode="login" />; }
export function Register() { return <AuthPage mode="register" />; }
export function RequireAuth({ children }) {
  const location = useLocation();
  return getAuthToken() ? children : <Navigate to="/login" state={{ from: location.pathname + location.search }} replace />;
}
