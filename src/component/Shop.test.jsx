// @vitest-environment jsdom
import React from 'react';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Shop from './Shop';
import { api } from '../api';

vi.mock('./Header', () => ({ default: () => null }));
vi.mock('./Footer', () => ({ default: () => null }));
vi.mock('../api', () => ({ api: vi.fn() }));

beforeEach(() => {
  window.scrollTo = vi.fn();
  api.mockResolvedValue({ data: [{ _id: 'aaaaaaaaaaaaaaaaaaaaaaaa', name: 'QA regression product', price: 10, rating: 5, oldPrice: 0, image: '/test.png' }], pagination: { total: 1 } });
});

it('exposes named colour toggles and sends the selected colour to product filtering', async () => {
  render(<MemoryRouter><Shop /></MemoryRouter>);
  await screen.findByRole('heading', { name: 'QA regression product' });
  const purple = screen.getByRole('button', { name: 'Filter by Purple' });
  expect(purple.getAttribute('aria-pressed')).toBe('false');
  fireEvent.click(purple);
  expect(purple.getAttribute('aria-pressed')).toBe('true');
  fireEvent.click(screen.getByRole('button', { name: 'Apply Filter' }));
  await waitFor(() => expect(api.mock.calls.some(([url]) => new URLSearchParams(url.split('?')[1]).get('color') === '#7d06f5')).toBe(true));
  fireEvent.click(purple);
  expect(purple.getAttribute('aria-pressed')).toBe('false');
});

it('provides a native sort control that requests the chosen order', async () => {
  render(<MemoryRouter><Shop /></MemoryRouter>);
  await screen.findByRole('heading', { name: 'QA regression product' });
  const sorting = screen.getByRole('combobox', { name: 'Sort products' });
  fireEvent.change(sorting, { target: { value: 'price-low' } });
  expect(sorting.value).toBe('price-low');
  await waitFor(() => expect(api.mock.calls.some(([url]) => url.includes('sort=price-asc'))).toBe(true));
});

it('shows each size price on shop cards, including the fallback main price', async () => {
  api.mockResolvedValue({ data: [{ _id: 'a'.repeat(24), name: 'Size-priced shirt', price: 10, discount: '20%', rating: 5, image: '/test.png', sizes: ['Small', 'Large', 'XL'], sizePrices: [{ size: 'Small', price: 25 }, { size: 'Large', price: 40 }] }], pagination: { total: 1 } });
  render(<MemoryRouter><Shop /></MemoryRouter>);
  const prices = await screen.findByRole('list', { name: 'Prices by size' });
  const rows = within(prices).getAllByRole('listitem');
  expect(rows.map(row => row.textContent)).toEqual(['Small$20', 'Large$32', 'XL$10']);
});

it('exposes bounded native price sliders and applies or clears their values', async () => {
  render(<MemoryRouter><Shop /></MemoryRouter>);
  await screen.findByRole('heading', { name: 'QA regression product' });
  const min = screen.getByRole('slider', { name: 'Minimum price' });
  const max = screen.getByRole('slider', { name: 'Maximum price' });
  expect(min.type).toBe('range');
  expect(max.type).toBe('range');
  fireEvent.change(min, { target: { value: '2' } });
  fireEvent.change(max, { target: { value: '8' } });
  expect(min.getAttribute('aria-valuetext')).toBe('$2');
  expect(max.getAttribute('aria-valuetext')).toBe('$8');
  expect(Number(min.max)).toBe(7);
  expect(Number(max.min)).toBe(3);
  fireEvent.click(screen.getByRole('button', { name: 'Apply Filter' }));
  await waitFor(() => expect(api.mock.calls.some(([url]) => url.includes('minPrice=2') && url.includes('maxPrice=8'))).toBe(true));
  fireEvent.click(screen.getByRole('button', { name: 'Clear Filters' }));
  expect(min.value).toBe('0');
  expect(max.value).toBe('10');
});
afterEach(() => { cleanup(); vi.clearAllMocks(); });

it('renders the shop route and loads products without a runtime error', async () => {
  render(<MemoryRouter initialEntries={['/shop']}><Shop /></MemoryRouter>);
  expect(await screen.findByRole('heading', { name: 'Shop', exact: true })).toBeTruthy();
  expect(await screen.findByRole('heading', { name: 'QA regression product' })).toBeTruthy();
});
