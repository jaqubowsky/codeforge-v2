export function formatSalaryRange(
  min: number,
  max: number,
  currency: string,
  maxLimit: number
): string {
  const formatNumber = (num: number) => {
    if (num >= 1_000_000) {
      const mValue = num / 1_000_000;
      return mValue % 1 === 0 ? `${mValue}M` : `${mValue.toFixed(1)}M`;
    }
    if (num >= 1000) {
      const kValue = num / 1000;
      return kValue % 1 === 0 ? `${kValue}k` : `${kValue.toFixed(1)}k`;
    }
    return num.toString();
  };

  if (max === maxLimit) {
    return `${formatNumber(min)} - ${formatNumber(max)}+ ${currency}`;
  }

  return `${formatNumber(min)} - ${formatNumber(max)} ${currency}`;
}

export function isValidSalaryRange(
  min: number,
  max: number,
  maxLimit: number
): boolean {
  return min >= 0 && max > min && max <= maxLimit;
}
