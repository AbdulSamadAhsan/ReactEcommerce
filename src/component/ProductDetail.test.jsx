// @vitest-environment jsdom
import React from 'react';
import { afterEach, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import ProductDetail from './ProductDetail';
import { api, addCartItem } from '../api';
vi.mock('./Header', () => ({ default: () => null }));
vi.mock('./Footer', () => ({ default: () => null }));
vi.mock('../api', () => ({ api: vi.fn(), addCartItem: vi.fn() }));
afterEach(() => { cleanup(); vi.clearAllMocks(); });
it('updates discounted price with the selected size and adds that size to cart', async () => {
  const product = { _id: 'a'.repeat(24), name: 'Size-priced shirt', price: 16, oldPrice: 20, discount: '20%', image: '/shirt.png', sizes: ['Small', 'Large', 'XL'], colors: ['Black'], stock: 10,
    sizePrices: [{ size: 'Small', price: 25 }, { size: 'Large', price: 40 }] };
  api.mockImplementation(async path => ({ data: path === '/products/' + product._id ? product : [] }));
  addCartItem.mockResolvedValue({ items: [] });
  render(<MemoryRouter initialEntries={['/products/' + product._id]}><Routes><Route path="/products/:id" element={<ProductDetail />} /></Routes></MemoryRouter>);
  expect(await screen.findByText('$20')).toBeTruthy();
  expect(screen.getByText('$25')).toBeTruthy();
  fireEvent.click(screen.getByRole('button', { name: 'Large', exact: true }));
  expect(screen.getByText('$32')).toBeTruthy();
  expect(screen.getByText('$40')).toBeTruthy();
  fireEvent.click(screen.getByRole('button', { name: 'Add to Cart', exact: true }));
  await waitFor(() => expect(addCartItem).toHaveBeenCalledWith({ productId: product._id, quantity: 1, size: 'Large', color: 'Black' }));
  fireEvent.click(screen.getByRole('button', { name: 'XL', exact: true }));
  expect(screen.getByText('$16')).toBeTruthy();
});
