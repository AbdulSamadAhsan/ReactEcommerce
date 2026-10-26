// @vitest-environment jsdom
import React from 'react';
import { afterEach, expect, it } from 'vitest';
import { cleanup, render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ProductCard from './ProductCard';
afterEach(cleanup);
it('shows size-specific prices on the product cards used by both home sections', () => {
  render(<MemoryRouter><ProductCard item={{ _id: 'shirt', name: 'Shirt', price: 10, rating: 5, image: '/test.png', sizes: ['Small', 'Large'], sizePrices: [{ size: 'Small', price: 12 }, { size: 'Large', price: 18 }] }} /></MemoryRouter>);
  const prices = screen.getByRole('list', { name: 'Prices by size' });
  expect(within(prices).getAllByRole('listitem').map(row => row.textContent)).toEqual(['Small$12', 'Large$18']);
  expect(screen.getByRole('link', { name: 'View Shirt' }).getAttribute('href')).toBe('/products/shirt');
});
