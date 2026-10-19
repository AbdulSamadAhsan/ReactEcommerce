// @vitest-environment jsdom
import React from 'react';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
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
afterEach(() => { cleanup(); vi.clearAllMocks(); });

it('renders the shop route and loads products without a runtime error', async () => {
  render(<MemoryRouter initialEntries={['/shop']}><Shop /></MemoryRouter>);
  expect(await screen.findByRole('heading', { name: 'Shop', exact: true })).toBeTruthy();
  expect(await screen.findByRole('heading', { name: 'QA regression product' })).toBeTruthy();
});
