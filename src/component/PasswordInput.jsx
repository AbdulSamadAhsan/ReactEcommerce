import React, { useId, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import './PasswordInput.css';

export default function PasswordInput({ id, disabled, ...props }) {
  const generatedId = useId();
  const inputId = id || generatedId;
  const [visible, setVisible] = useState(false);
  return <span className="password-field">
    <input {...props} id={inputId} disabled={disabled} type={visible ? 'text' : 'password'} />
    <button type="button" className="password-toggle" disabled={disabled} aria-label={visible ? 'Hide password' : 'Show password'} aria-pressed={visible} aria-controls={inputId} onClick={() => setVisible(value => !value)}>
      {visible ? <EyeOff size={20} aria-hidden="true" /> : <Eye size={20} aria-hidden="true" />}
    </button>
  </span>;
}
