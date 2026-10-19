# SHOP.CO Storefront

React e-commerce storefront with product browsing, cart, checkout, account pages, and Stripe integration.

[Live deployment](https://reactshopco.vercel.app)

## Overview

- Product listing and detail pages
- Cart, checkout, and account interfaces
- Stripe payment components
- Checkout tests with Vitest

## Stack

React, Vite.

## Run locally

```bash
git clone https://github.com/AbdulSamadAhsan/ReactEcommerce.git
cd ReactEcommerce
npm install
```

Set `VITE_API_URL` in `.env.local` to point to your API, such as `http://localhost:3000/api`. The default points to the deployed SHOP.CO API. Backend: [shopco-api](https://github.com/AbdulSamadAhsan/shopco-api). Payment flows require Stripe configuration.

```bash
npm run dev
```

Use the local URL printed by the development server.

## Available checks

| Command | Script |
| --- | --- |
| `npm run build` | `vite build` |
| `npm run preview` | `vite preview` |
| `npm run test` | `vitest run --pool=threads --maxWorkers=1` |

These commands are defined by the project; documentation updates do not imply they have been run.

## Author

[Syed Abdul Samad Ahsan](https://github.com/AbdulSamadAhsan)
