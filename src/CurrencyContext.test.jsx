// @vitest-environment jsdom
import React from 'react';
import { afterEach, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { CurrencyProvider } from './CurrencyContext';
import ProductCard from './component/ProductCard';
import { api } from './api';
vi.mock('./api', () => ({ api: vi.fn() }));
afterEach(() => { cleanup(); vi.useRealTimers(); vi.clearAllMocks(); });
it('converts catalogue prices and refreshes the currency when the shopper returns', async () => {
  api.mockResolvedValue({ data: { currency: 'PKR', exchangeRate: 280 } });
  render(<MemoryRouter><CurrencyProvider><ProductCard item={{ _id: 'one', name: 'Coat', image: '/coat.png', price: 80, oldPrice: 100, rating: 5 }} /></CurrencyProvider></MemoryRouter>);
  expect(await screen.findByText(/PKR.*22,400/)).toBeTruthy();
  expect(screen.getByText(/PKR.*28,000/)).toBeTruthy();
  api.mockResolvedValue({ data: { currency: 'USD', exchangeRate: 1 } });
  fireEvent.focus(window);
  expect(await screen.findByText('$80')).toBeTruthy();
  expect(screen.getByText('$100')).toBeTruthy();
});

it('updates prices on an open page within five seconds without focus or reload', async () => {
  vi.useFakeTimers();
  api.mockResolvedValue({ data: { currency: 'PKR', exchangeRate: 100 } });
  await act(async () => {
    render(<MemoryRouter><CurrencyProvider><ProductCard item={{ _id: 'one', name: 'Coat', image: '/coat.png', price: 80, rating: 5 }} /></CurrencyProvider></MemoryRouter>);
  });
  expect(screen.getByText(/PKR.*8,000/)).toBeTruthy();
  api.mockResolvedValue({ data: { currency: 'PKR', exchangeRate: 200 } });
  await act(async () => { await vi.advanceTimersByTimeAsync(5000); });
  expect(screen.getByText(/PKR.*16,000/)).toBeTruthy();
  api.mockResolvedValue({ data: { currency: 'USD', exchangeRate: 1 } });
  await act(async () => { await vi.advanceTimersByTimeAsync(5000); });
  expect(screen.getByText('$80')).toBeTruthy();
  expect(api.mock.calls.at(-1)[1].cache).toBe('no-store');
});
