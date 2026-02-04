import { SALARY_MAX } from "../constants";

export function formatSalaryRange(
  min: number,
  max: number,
  currency: string
): string {
  const formatNumber = (num: number) => {
    if (num >= 1000) {
      const kValue = num / 1000;
      if (kValue % 1 === 0) {
        return `${kValue}k`;
      }
      return `${kValue.toFixed(1)}k`;
    }
    return num.toString();
  };

  if (max === SALARY_MAX) {
    return `${formatNumber(min)} - ${formatNumber(max)}+ ${currency}`;
  }

  return `${formatNumber(min)} - ${formatNumber(max)} ${currency}`;
}

export function isValidSalaryRange(min: number, max: number): boolean {
  return min >= 0 && max > min && max <= SALARY_MAX;
}
