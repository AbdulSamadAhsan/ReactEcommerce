export function paymentLabel(order) {
  const states = { paid: 'Paid', refunded: 'Refunded', failed: 'Payment failed', expired: 'Payment expired' };
  if (states[order.paymentStatus]) return states[order.paymentStatus];
  if (order.status === 'cancelled') return 'Not charged';
  return order.paymentMethod === 'cash_on_delivery' ? 'Pay on delivery' : 'Payment pending';
}
