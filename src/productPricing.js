export function discountLabel(product) {
  const price = Number(product.price);
  const oldPrice = Number(product.oldPrice);
  if (!Number.isFinite(price) || price < 0 || !Number.isFinite(oldPrice) || oldPrice <= price) return '';
  const percentage = Math.round((1 - price / oldPrice) * 100);
  return percentage > 0 ? `${percentage}%` : '';
}
