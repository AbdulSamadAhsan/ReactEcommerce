// @vitest-environment jsdom
import React from 'react';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { cleanup, render, screen, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Header from './Header';
import { getCart } from '../api';

vi.mock('../api', () => ({
  getAuthToken: () => null,
  getCurrentUser: () => null,
  getCart: vi.fn(),
  logout: vi.fn(),
}));

beforeEach(() => { localStorage.clear(); getCart.mockResolvedValue({ items: [] }); });
afterEach(() => { cleanup(); vi.clearAllMocks(); });
const showHeader = () => render(<MemoryRouter><Header /></MemoryRouter>);
const updateCart = items => act(() => {
  localStorage.setItem('cart', JSON.stringify(items));
  window.dispatchEvent(new Event('shopco:cart'));
});

it('sums quantities and updates the badge after cart changes and removal', () => {
  localStorage.setItem('cart', JSON.stringify([{ quantity: 2 }, { quantity: 3 }]));
  showHeader();
  expect(screen.getByRole('link', { name: 'Shopping cart, 5 items' }).textContent).toBe('5');
  updateCart([{ quantity: 1 }]);
  expect(screen.getByRole('link', { name: 'Shopping cart, 1 item' }).textContent).toBe('1');
  updateCart([]);
  expect(screen.getByRole('link', { name: 'Shopping cart, 0 items' }).textContent).toBe('0');
});

it('refreshes from the server and caps only the visible badge', async () => {
  getCart.mockImplementation(async () => { updateCart([{ quantity: 102 }]); return { items: [{ quantity: 102 }] }; });
  showHeader();
  expect((await screen.findByRole('link', { name: 'Shopping cart, 102 items' })).textContent).toBe('99+');
});

it('handles damaged cache and updates from another browser tab', () => {
  localStorage.setItem('cart', '{bad json');
  showHeader();
  expect(screen.getByRole('link', { name: 'Shopping cart, 0 items' })).toBeTruthy();
  act(() => {
    localStorage.setItem('cart', JSON.stringify([{ quantity: 4 }]));
    window.dispatchEvent(new StorageEvent('storage', { key: 'cart' }));
  });
  expect(screen.getByRole('link', { name: 'Shopping cart, 4 items' }).textContent).toBe('4');
});
