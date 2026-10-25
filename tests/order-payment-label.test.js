import { test } from 'node:test';
import assert from 'node:assert/strict';
import { paymentLabel } from '../src/orderPaymentLabel.js';

test('customer payment labels preserve settlement, refunds and failures for both methods', () => {
  for (const paymentMethod of ['cash_on_delivery', 'stripe']) {
    for (const status of ['pending', 'delivered', 'cancelled']) {
      for (const [paymentStatus, label] of Object.entries({ paid: 'Paid', refunded: 'Refunded', failed: 'Payment failed', expired: 'Payment expired' })) {
        assert.equal(paymentLabel({ paymentMethod, status, paymentStatus }), label);
      }
    }
  }
  assert.equal(paymentLabel({ paymentMethod: 'cash_on_delivery', status: 'delivered', paymentStatus: 'unpaid' }), 'Pay on delivery');
  assert.equal(paymentLabel({ paymentMethod: 'stripe', status: 'delivered', paymentStatus: 'unpaid' }), 'Payment pending');
  assert.equal(paymentLabel({ status: 'cancelled', paymentStatus: 'unpaid' }), 'Not charged');
});
