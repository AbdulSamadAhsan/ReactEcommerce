// @vitest-environment jsdom
import React from 'react';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Cart from './Cart';
import { getCart, saveCart } from '../api';
vi.mock('./Header', () => ({ default: () => null }));
vi.mock('./Footer', () => ({ default: () => null }));
vi.mock('../api', () => ({ getCart: vi.fn(), saveCart: vi.fn() }));
const item = { productId: 'one', name: 'Shirt', quantity: 1, size: 'Small', color: 'Black', price: 10, stock: 10, available: true, availableSizes: ['Small', 'Large'] };
const cart = { items: [item], revision: 7, promoCode: '', currency: 'USD', totals: { subtotal: 10, discount: 0, gst: 1.6, deliveryFee: 15, total: 26.6 } };
const showCart = () => render(<MemoryRouter><Cart /></MemoryRouter>);
beforeEach(() => { vi.clearAllMocks(); getCart.mockResolvedValue(cart); });
afterEach(cleanup);

it('changes size and displays the returned unit price and cart total', async () => {
  saveCart.mockResolvedValue({ ...cart, items: [{ ...item, size: 'Large', price: 20 }], revision: 8, totals: { ...cart.totals, subtotal: 20, gst: 3.2, total: 38.2 } });
  showCart();
  const select = await screen.findByRole('combobox', { name: /Size for Shirt/ });
  fireEvent.change(select, { target: { value: 'Large' } });
  await screen.findByText('$38.20');
  expect(screen.getByRole('combobox', { name: /Size for Shirt/ }).value).toBe('Large');
  expect(screen.getAllByText('$20.00').length).toBeGreaterThan(0);
  expect(saveCart.mock.calls[0][0].revision).toBe(7);
  expect(saveCart.mock.calls[0][1][0].size).toBe('Large');
});

it('merges matching product, size and colour rows without losing quantity', async () => {
  getCart.mockResolvedValue({ ...cart, items: [item, { ...item, size: 'Large', quantity: 2, price: 20 }] });
  saveCart.mockResolvedValue({ ...cart, items: [{ ...item, size: 'Large', quantity: 3, price: 20 }] });
  showCart();
  const select = await screen.findByRole('combobox', { name: /currently Small/ });
  fireEvent.change(select, { target: { value: 'Large' } });
  await waitFor(() => expect(saveCart).toHaveBeenCalledTimes(1));
  const items = saveCart.mock.calls[0][1];
  expect(items).toHaveLength(1);
  expect(items[0].size).toBe('Large');
  expect(items[0].quantity).toBe(3);
  expect(item.quantity).toBe(1);
});

it('keeps the previous size and price when saving fails', async () => {
  saveCart.mockRejectedValue(new Error('Size unavailable'));
  showCart();
  fireEvent.change(await screen.findByRole('combobox', { name: /Size for Shirt/ }), { target: { value: 'Large' } });
  await screen.findByRole('alert');
  expect(screen.getByRole('combobox', { name: /Size for Shirt/ }).value).toBe('Small');
  expect(screen.getByText('$26.60')).toBeTruthy();
});
