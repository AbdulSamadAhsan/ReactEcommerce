import PasswordInput from './PasswordInput';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { updateAccount } from '../api';

export default function AccountSettings({ user, onSaved, onUnauthorized }) {
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  async function save(event) {
    event.preventDefault();
    if (busy) return;
    const fields = Object.fromEntries(new FormData(event.currentTarget));
    if (fields.newPassword !== fields.confirmPassword) { setError('New passwords do not match.'); return; }
    delete fields.confirmPassword;
    if (!fields.newPassword) delete fields.newPassword;
    setBusy(true); setError(''); setSuccess('');
    try {
      const result = await updateAccount(fields);
      if (result.requiresLogin) {
        navigate('/login', { replace: true, state: { from: '/account', notice: 'Password updated. Please sign in with your new password.' } });
        return;
      }
      onSaved(result.user);
      setEditing(false);
      setSuccess('Your account details have been updated.');
    } catch (error) {
      if (error.status === 401) onUnauthorized(error);
      else setError(error.message);
    } finally { setBusy(false); }
  }
  return <div className="account-settings">
    {success && <p className="account-settings-success" role="status">{success}</p>}
    {!editing ? <button className="account-edit-button" onClick={() => { setEditing(true); setError(''); setSuccess(''); }}>Edit account details</button> : <form onSubmit={save} aria-label="Edit account details" aria-busy={busy}>
      <h3>Account settings</h3>
      <fieldset disabled={busy}>
        <label htmlFor="account-first-name">First name</label><input id="account-first-name" name="firstName" autoComplete="given-name" required maxLength={100} defaultValue={user.firstName || user.name.split(' ')[0]} />
        <label htmlFor="account-last-name">Last name</label><input id="account-last-name" name="lastName" autoComplete="family-name" required maxLength={100} defaultValue={user.lastName || user.name.split(' ').slice(1).join(' ')} />
        <label htmlFor="account-email">Email address</label><input id="account-email" name="email" type="email" autoComplete="email" required maxLength={254} defaultValue={user.email} />
        <label htmlFor="account-phone">Mobile number</label><input id="account-phone" name="phone" type="tel" autoComplete="tel" maxLength={30} defaultValue={user.phone || ''} aria-describedby="account-phone-help" />
        <small id="account-phone-help">Include your country code, for example +92 300 1234567.</small>
        <label htmlFor="account-new-password">New password (optional)</label><PasswordInput id="account-new-password" name="newPassword"  autoComplete="new-password" minLength={10} aria-describedby="account-new-password-help" />
        <small id="account-new-password-help">Leave blank to keep your password. Use at least 10 characters.</small>
        <label htmlFor="account-confirm-password">Confirm new password</label><PasswordInput id="account-confirm-password" name="confirmPassword"  autoComplete="new-password" />
      </fieldset>
      {error && <p className="account-settings-error" role="alert">{error}</p>}
      <div className="account-settings-actions"><button className="account-edit-button" disabled={busy} type="submit">{busy ? 'Saving…' : 'Save changes'}</button><button type="button" disabled={busy} onClick={() => { setEditing(false); setError(''); }}>Cancel</button></div>
    </form>}
  </div>;
}
