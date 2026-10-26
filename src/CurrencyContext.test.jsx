// @vitest-environment jsdom
import React from 'react';
import { afterEach, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { CurrencyProvider } from './CurrencyContext';
import ProductCard from './component/ProductCard';
import { api } from './api';
vi.mock('./api', () => ({ api: vi.fn() }));
afterEach(() => { cleanup(); vi.clearAllMocks(); });
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
