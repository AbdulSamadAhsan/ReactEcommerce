import PasswordInput from './PasswordInput';
import React, { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import { getAuthToken, login, register } from '../api';
import './Auth.css';

export function AuthPage({ mode = 'login' }) {
  const isRegister = mode === 'register';
  const location = useLocation(); const navigate = useNavigate();
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', password: '' });
  const [error, setError] = useState(''); const [busy, setBusy] = useState(false);
  if (getAuthToken()) return <Navigate to={location.state?.from || '/'} replace />;
  async function submit(e) {
    e.preventDefault(); setBusy(true); setError('');
    try { await (isRegister ? register(form) : login({ email: form.email, password: form.password })); navigate(location.state?.from || '/', { replace: true }); }
    catch (err) { setError(err.message); } finally { setBusy(false); }
  }
  return <><Header /><main className="auth-page"><section className="auth-card"><h1>{isRegister ? 'Create your account' : 'Welcome back'}</h1><p>{isRegister ? 'Register to save your details and continue to checkout.' : 'Log in to continue to checkout.'}</p>{!isRegister && location.state?.notice && <p role="status">{location.state.notice}</p>}{error && <p className="auth-error" role="alert">{error}</p>}
    <form className="auth-form" onSubmit={submit}>{isRegister && <><label>First name<input required maxLength={100} value={form.firstName} onChange={e => setForm({ ...form, firstName: e.target.value })} autoComplete="given-name" /></label><label>Last name<input required maxLength={100} value={form.lastName} onChange={e => setForm({ ...form, lastName: e.target.value })} autoComplete="family-name" /></label></>}<label>Email<input required type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} autoComplete="email" /></label>{isRegister && <label>Mobile number<input required type="tel" maxLength={30} value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} autoComplete="tel" placeholder="e.g. +92 300 1234567" /></label>}<label>Password<PasswordInput required minLength={isRegister ? 10 : 1}  value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} autoComplete={isRegister ? 'new-password' : 'current-password'} /></label><button disabled={busy}>{busy ? 'Please wait…' : isRegister ? 'Create account' : 'Log in'}</button></form>
    {!isRegister && <Link className="auth-link" to="/forgot-password">Forgot password?</Link>}
    <Link className="auth-link" to={isRegister ? '/login' : '/register'} state={location.state}>{isRegister ? 'Already have an account? Log in' : 'New to SHOP.CO? Create an account'}</Link>
  </section></main><Footer /></>;
}
export function Login() { return <AuthPage mode="login" />; }
export function Register() { return <AuthPage mode="register" />; }
export function RequireAuth({ children }) {
  const location = useLocation();
  return getAuthToken() ? children : <Navigate to="/login" state={{ from: location.pathname + location.search }} replace />;
}
