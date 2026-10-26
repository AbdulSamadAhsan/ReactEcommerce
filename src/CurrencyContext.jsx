import React, { createContext, useContext, useEffect, useState } from 'react';
import { api } from './api';
import { convertPrice, defaultCurrency, formatMoney } from './currency';

const CurrencyContext = createContext(defaultCurrency);
export function useCurrency() {
  const settings = useContext(CurrencyContext);
  return { ...settings, money: value => formatMoney(convertPrice(value, settings.exchangeRate), settings.currency, 0) };
}
export function CurrencyProvider({ children }) {
  const [settings, setSettings] = useState(null);
  const [error, setError] = useState('');
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    let loading = false;
    const refresh = async () => {
      if (loading) return;
      loading = true;
      try {
        const { data } = await api('/store-settings', { signal: controller.signal, cache: 'no-store' });
        if (!['USD', 'PKR'].includes(data.currency) || !Number.isFinite(data.exchangeRate) || data.exchangeRate <= 0) throw new Error();
        if (!controller.signal.aborted) { setSettings(previous => previous?.currency === data.currency && previous.exchangeRate === data.exchangeRate ? previous : data); setError(''); }
      } catch {
        if (!controller.signal.aborted) setError('Store prices are unavailable. Please try again.');
      } finally { loading = false; }
    };
    refresh();
    window.addEventListener('focus', refresh);
    const timer = window.setInterval(refresh, 5000);
    return () => { controller.abort(); window.clearInterval(timer); window.removeEventListener('focus', refresh); };
  }, [retry]);
  return <CurrencyContext.Provider value={settings || defaultCurrency}>
    {error && <p className="shell" role="alert">{error} <button onClick={() => setRetry(value => value + 1)}>Try again</button></p>}
    {settings ? children : !error && <p className="shell" role="status">Loading store…</p>}
  </CurrencyContext.Provider>;
}
