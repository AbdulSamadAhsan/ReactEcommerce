import PasswordInput from './PasswordInput';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, logout } from '../api';
import Header from './Header';
import Footer from './Footer';
import './Auth.css';

export function ForgotPassword() {
  const [email, setEmail] = useState(''), [message, setMessage] = useState(''), [error, setError] = useState(''), [busy, setBusy] = useState(false);
  async function submit(event) {
    event.preventDefault(); if (busy) return;
    setBusy(true); setError(''); setMessage('');
    try { const result = await api('/auth/forgot-password', { method: 'POST', body: { email } }); setMessage(result.data.message); }
    catch (error) { setError(error.message); } finally { setBusy(false); }
  }
  return <><Header /><main className="auth-page"><section className="auth-card"><h1>Forgot password?</h1><p>Enter your account email. We’ll send you a link to choose a new password.</p>
    {message && <p role="status" className="auth-success">{message}</p>}{error && <p role="alert" className="auth-error">{error}</p>}
    <form className="auth-form" onSubmit={submit}><label>Email<input type="email" required maxLength={254} autoComplete="email" value={email} disabled={busy} onChange={event => setEmail(event.target.value)} /></label><button disabled={busy}>{busy ? 'Sending…' : 'Send reset link'}</button></form>
    <Link className="auth-link" to="/login">Back to log in</Link></section></main><Footer /></>;
}

export function ResetPassword() {
  const [token] = useState(() => new URLSearchParams(window.location.hash.slice(1)).get('token') || '');
  const [password, setPassword] = useState(''), [confirmation, setConfirmation] = useState(''), [message, setMessage] = useState(''), [error, setError] = useState(''), [busy, setBusy] = useState(false);
  const validLink = /^[a-f0-9]{64}$/.test(token);
  useEffect(() => { if (window.location.hash) window.history.replaceState(window.history.state, '', window.location.pathname + window.location.search); }, []);
  async function submit(event) {
    event.preventDefault(); if (busy) return;
    if (password !== confirmation) { setError('Your passwords do not match'); return; }
    setBusy(true); setError('');
    try { const result = await api('/auth/reset-password', { method: 'POST', body: { token, password } }); logout(); setPassword(''); setConfirmation(''); setMessage(result.data.message); }
    catch (error) { setError(error.message); } finally { setBusy(false); }
  }
  return <><Header /><main className="auth-page"><section className="auth-card"><h1>Reset password</h1>
    {message ? <><p role="status" className="auth-success">{message}</p><Link className="auth-link" to="/login">Log in with your new password</Link></> : !validLink ? <><p role="alert" className="auth-error">This reset link is missing or invalid.</p><Link className="auth-link" to="/forgot-password">Request a new reset link</Link></> : <>
      <p>Choose a new password with at least 10 characters.</p>{error && <p role="alert" className="auth-error">{error}</p>}
      <form className="auth-form" onSubmit={submit}><label>New password<PasswordInput  required minLength={10} autoComplete="new-password" value={password} disabled={busy} onChange={event => setPassword(event.target.value)} /></label><label>Confirm new password<PasswordInput  required minLength={10} autoComplete="new-password" value={confirmation} disabled={busy} onChange={event => setConfirmation(event.target.value)} /></label><button disabled={busy}>{busy ? 'Updating…' : 'Reset password'}</button></form>
      <Link className="auth-link" to="/forgot-password">Request a new link</Link></>}
  </section></main><Footer /></>;
}
