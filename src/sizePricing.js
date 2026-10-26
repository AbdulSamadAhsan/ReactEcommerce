export function sizePricing(product, size) {
  const override = (product?.sizePrices || []).find(row => row.size === size);
  if (!override) return { price: Number(product?.price || 0), oldPrice: Number(product?.oldPrice || 0) };
  const discount = Math.max(0, Math.min(100, Number.parseFloat(product.discount) || 0));
  return { price: Math.round(override.price * (1 - discount / 100) * 100) / 100, oldPrice: discount > 0 ? override.price : 0 };
}

export function catalogPricing(product) {
  const prices = product.sizePrices?.length && product.sizes?.length
    ? product.sizes.map(size => sizePricing(product, size)) : [sizePricing(product)];
  const lowest = prices.reduce((best, price) => price.price < best.price ? price : best);
  return { ...lowest, varies: prices.some(price => price.price !== lowest.price) };
}
