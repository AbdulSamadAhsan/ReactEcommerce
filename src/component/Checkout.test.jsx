// @vitest-environment jsdom
import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Checkout from './Checkout';
import * as api from '../api';

vi.mock('./Header', () => ({ default: () => null }));
vi.mock('./StripePayment', () => ({ default: () => <div>Stripe payment form</div> }));
vi.mock('../api', () => ({
  getCurrentUser: vi.fn(() => ({ _id: 'qa', firstName: 'Test', lastName: 'Customer' })),
  getCart: vi.fn(), saveCart: vi.fn(), createOrder: vi.fn(), logout: vi.fn(),
  startStripeCheckout: vi.fn(), getStripeCheckout: vi.fn(), cancelStripeCheckout: vi.fn(),
  cartLine: ({ productId, quantity, size, color }) => ({ productId, quantity, size, color }),
}));

const key = 'shopco.checkout.qa';
const shipping = { firstName: 'Test', lastName: 'Customer', email: 'qa@example.com', phone: '+12025550147', address: 'Test street', state: 'Test state', zip: '10001' };
const completed = {
  key: 'original-idempotency-key', revision: 4, stripeSessionId: 'cs_test_original',
  body: { shipping, paymentMethod: 'stripe', promoCode: 'WELCOME20', items: [{ productId: 'a', quantity: 1 }] },
  order: { _id: 'order-one', total: 89.24, currency: 'USD', paymentMethod: 'stripe', status: 'pending' },
};
const freshCart = {
  revision: 6, promoCode: '',
  items: [{ productId: 'b', name: 'Product B', quantity: 1, price: 145, size: 'Small', color: 'green' }],
  totals: { subtotal: 145, discount: 0, gst: 23.2, deliveryFee: 15, total: 183.2 },
};
const mount = () => render(<MemoryRouter><Checkout /></MemoryRouter>);

beforeEach(() => {
  vi.clearAllMocks();
  sessionStorage.clear();
  window.history.replaceState({}, '', '/checkout');
  api.getCart.mockResolvedValue(freshCart);
  api.startStripeCheckout.mockResolvedValue({ sessionId: 'cs_test_second', clientSecret: 'test-placeholder' });
});
afterEach(cleanup);

describe('checkout after a completed order', () => {
  it('opens a new checkout and uses fresh items, totals, coupon and idempotency key', async () => {
    sessionStorage.setItem(key, JSON.stringify(completed));
    mount();
    await screen.findByRole('heading', { name: 'Shipping Details' });
    expect(screen.queryByText('order-one')).toBeNull();
    expect(screen.getByText('Product B')).toBeTruthy();
    expect(screen.getByText('$183.20')).toBeTruthy();
    expect(sessionStorage.getItem(key)).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Continue to payment' }));
    await waitFor(() => expect(api.startStripeCheckout).toHaveBeenCalledTimes(1));
    const [body, newKey] = api.startStripeCheckout.mock.calls[0];
    expect(body.promoCode).toBe('');
    expect(body.items[0].productId).toBe('b');
    expect(newKey).not.toBe(completed.key);
    expect(api.createOrder).not.toHaveBeenCalled();
  });

  it('preserves confirmation on refresh when the purchased cart has been cleared', async () => {
    sessionStorage.setItem(key, JSON.stringify(completed));
    api.getCart.mockResolvedValue({ ...freshCart, items: [] });
    mount();
    await waitFor(() => expect(api.getCart).toHaveBeenCalled());
    expect(screen.getByText('order-one')).toBeTruthy();
    expect(JSON.parse(sessionStorage.getItem(key)).order._id).toBe('order-one');
    expect(api.saveCart).not.toHaveBeenCalled();
    expect(api.startStripeCheckout).not.toHaveBeenCalled();
  });

  it('does not resubmit an unchanged cart when clearing the paid cart failed', async () => {
    sessionStorage.setItem(key, JSON.stringify({ ...completed, notice: 'Review your cart before ordering again.' }));
    api.getCart.mockResolvedValue({ ...freshCart, revision: completed.revision });
    mount();
    await waitFor(() => expect(api.getCart).toHaveBeenCalled());
    expect(screen.getByText('order-one')).toBeTruthy();
    expect(screen.getByRole('alert').textContent).toContain('Review your cart');
    expect(screen.queryByRole('heading', { name: 'Shipping Details' })).toBeNull();
  });

  it('preserves a pending Stripe attempt even if the cart changed', async () => {
    const { order, ...pending } = completed;
    sessionStorage.setItem(key, JSON.stringify(pending));
    mount();
    await screen.findByRole('heading', { name: 'Complete your payment' });
    fireEvent.click(screen.getByRole('button', { name: 'Continue to payment' }));
    await waitFor(() => expect(api.startStripeCheckout).toHaveBeenCalled());
    expect(api.startStripeCheckout.mock.calls[0][1]).toBe(completed.key);
    expect(api.startStripeCheckout.mock.calls[0][0]).toEqual(completed.body);
  });

  it('keeps the original confirmation when revisiting a verified Stripe return', async () => {
    sessionStorage.setItem(key, JSON.stringify(completed));
    window.history.replaceState({}, '', '/checkout?session_id=cs_test_original');
    api.getStripeCheckout.mockResolvedValue({ paid: true, order: completed.order });
    mount();
    await waitFor(() => expect(api.getStripeCheckout).toHaveBeenCalledWith('cs_test_original'));
    expect(screen.getByText('order-one')).toBeTruthy();
    expect(api.getCart).not.toHaveBeenCalled();
    expect(api.saveCart).not.toHaveBeenCalled();
  });

  it('does not discard a completed attempt if the cart request fails', async () => {
    sessionStorage.setItem(key, JSON.stringify(completed));
    api.getCart.mockRejectedValue(new Error('Network unavailable'));
    mount();
    await waitFor(() => expect(api.getCart).toHaveBeenCalled());
    expect(screen.getByText('order-one')).toBeTruthy();
    expect(JSON.parse(sessionStorage.getItem(key)).order._id).toBe('order-one');
  });
});
