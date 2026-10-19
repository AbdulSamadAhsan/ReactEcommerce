export function hasDiscount(value) {
  const percentage = Number.parseFloat(value);
  return Number.isFinite(percentage) && percentage !== 0;
}
