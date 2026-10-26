export const defaultCurrency = { currency: 'USD', exchangeRate: 1 };
export const convertPrice = (value, exchangeRate) => Math.round((Number(value || 0) * exchangeRate + Number.EPSILON) * 100) / 100;
export const formatMoney = (value, currency = 'USD', minimumFractionDigits = 2) => new Intl.NumberFormat('en-US', {
  style: 'currency', currency, minimumFractionDigits, maximumFractionDigits: 2,
}).format(Number(value || 0));
