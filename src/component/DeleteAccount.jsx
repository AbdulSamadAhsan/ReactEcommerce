import PasswordInput from './PasswordInput';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { deleteAccount } from '../api';

export default function DeleteAccount({ onUnauthorized }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  async function remove(event) {
    event.preventDefault();
    if (busy) return;
    const currentPassword = new FormData(event.currentTarget).get('currentPassword');
    setBusy(true); setError('');
    try {
      await deleteAccount(currentPassword);
      navigate('/login', { replace: true, state: { notice: 'Your account has been deleted.' } });
    } catch (error) {
      if (error.status === 401) onUnauthorized(error);
      else setError(error.message);
    } finally { setBusy(false); }
  }
  return <section className="account-delete" aria-labelledby="account-delete-heading">
    <h3 id="account-delete-heading">Delete account</h3>
    <p>Permanently delete your account and sign out on all devices. Past order records are retained by the store. Deleting your account does not cancel existing orders.</p>
    {!open ? <button className="account-delete-button" onClick={() => setOpen(true)}>Delete my account</button> : <form onSubmit={remove} aria-label="Confirm account deletion" aria-busy={busy}>
      <label htmlFor="delete-account-password">Current password</label>
      <PasswordInput id="delete-account-password"  name="currentPassword" autoComplete="current-password" required disabled={busy} />
      <label className="account-delete-confirm"><input type="checkbox" required disabled={busy} />I understand this permanently deletes my account.</label>
      {error && <p className="account-settings-error" role="alert">{error}</p>}
      <div className="account-settings-actions"><button className="account-delete-button" type="submit" disabled={busy}>{busy ? 'Deleting…' : 'Permanently delete account'}</button><button type="button" disabled={busy} onClick={() => { setOpen(false); setError(''); }}>Cancel</button></div>
    </form>}
  </section>;
}
