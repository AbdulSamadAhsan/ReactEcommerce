# SHOP.CO React UI

Responsive React/Vite implementation inspired by the linked Figma Community e-commerce template.

## Run locally

```bash
npm install
npm run dev
```

Open the local URL shown by Vite.

## Build

```bash
npm run build
```

The page includes the announcement bar, responsive navigation, hero, brand strip, new arrivals, top selling products, dress styles, customer reviews, newsletter, and footer.

## Checkout

Checkout posts to `/orders` using the saved sign-in token and an `Idempotency-Key`.
It sends product selections, shipping details and the cart promo code; the API
calculates final prices. Customers can choose cash on delivery or card via Stripe
test Checkout. Shipping asks for name, email, phone, street address, state/province,
and postal code; city and country are not required.
Card checkout redirects to Stripe and the API verifies payment before confirming
the order. A pending card checkout can be cancelled to change payment method.
Stripe secrets belong only in the API environment, never in the frontend.

For the local API, set `VITE_API_URL=http://localhost:3000/api` in `.env.local`.
Pending requests are saved per user in session storage and retried with the same
body and key after an uncertain response or page reload. Successful orders show
an order number and clear the guest cart using its submitted revision, preserving
cart changes from other tabs. An expired sign-in returns the customer to login.

Set `VITE_API_URL` to override the default deployed API URL in `src/api.js`.

## Stripe test payments

Checkout supports cash on delivery and Stripe-hosted test-card checkout. No Stripe
secret or publishable key is needed in the browser. Card details are entered only
on Stripe. A return URL never proves payment: the API verifies the session and
payment before showing a paid confirmation. Returning without paying lets the
customer resume the same session or cancel it and edit the order.

Registration accepts separate first and last names. Login returns both fields,
which prefill shipping at checkout; legacy full-name accounts remain compatible.
