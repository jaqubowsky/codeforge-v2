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
  return similarityScore ? Math.round(similarityScore * 100) : null;
}
