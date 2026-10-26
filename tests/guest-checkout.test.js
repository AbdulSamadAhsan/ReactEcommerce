import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
const source = (await readFile(new URL('../src/api.js', import.meta.url), 'utf8')).replace('import.meta.env.VITE_API_URL', JSON.stringify('https://example.test/api'));
const api = await import('data:text/javascript;base64,' + Buffer.from(source).toString('base64'));

test('guest order and payment requests send the same cart token without a fake auth header', async () => {
  const previous = { fetch: globalThis.fetch, localStorage: globalThis.localStorage };
  const stored = new Map();
  const requests = [];
  globalThis.localStorage = { getItem: key => stored.get(key) ?? null, setItem: (key, value) => stored.set(key, value) };
  globalThis.fetch = async (url, options) => { requests.push({ url, options }); return { ok: true, json: async () => ({ data: {} }) }; };
  try {
    await api.createOrder({}, 'guest-order-key');
    await api.startStripeCheckout({}, 'guest-payment-key');
    await api.getStripeCheckout('cs_test_guest');
    await api.cancelStripeCheckout('cs_test_guest');
    const token = stored.get('shopco.cartToken');
    assert.match(token, /^[a-f0-9]{64}$/);
    for (const { options } of requests) {
      assert.equal(options.headers['X-Cart-Token'], token);
      assert.equal(options.headers.Authorization, undefined);
    }
    stored.set('shopco.authToken', 'signed-in-token');
    await api.createOrder({}, 'account-order-key');
    assert.equal(requests.at(-1).options.headers.Authorization, 'Bearer signed-in-token');
  } finally {
    for (const [key, value] of Object.entries(previous)) {
      if (value === undefined) delete globalThis[key]; else globalThis[key] = value;
    }
  }
});
