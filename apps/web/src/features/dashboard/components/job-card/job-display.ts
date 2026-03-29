export function formatSalaryDisplay(
  salaryFrom: number | null,
  salaryTo: number | null,
  currency: string | null
): string {
  if (salaryFrom && salaryTo && currency) {
    return `${salaryFrom.toLocaleString("en-US")} - ${salaryTo.toLocaleString("en-US")} ${currency}`;
  }
  return "Salary not disclosed";
}

export function calculateMatchPercentage(
  similarityScore: number | null
): number | null {
  if (!similarityScore) {
    return null;
  }
  const MIN_SCORE = 0.03;
  const MAX_SCORE = 0.98;
  const MIN_DISPLAY = 50;
  const MAX_DISPLAY = 99;
  const clamped = Math.max(MIN_SCORE, Math.min(MAX_SCORE, similarityScore));
  const normalized = (clamped - MIN_SCORE) / (MAX_SCORE - MIN_SCORE);
  return Math.round(MIN_DISPLAY + normalized * (MAX_DISPLAY - MIN_DISPLAY));
}
