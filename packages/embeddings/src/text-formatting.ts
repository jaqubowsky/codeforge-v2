export interface ProfileQueryData {
  skills: string[];
  experienceLevels: string[];
  workLocations: string[];
  idealRoleDescription: string;
}

export interface JobDocumentData {
  title: string;
  companyName?: string | null;
  experienceLevel?: string | null;
  workplaceType?: string | null;
  city?: string | null;
  technologies: string[];
  salaryFrom?: number | null;
  salaryTo?: number | null;
  salaryCurrency?: string | null;
}

export function formatProfileQuery(data: ProfileQueryData): string {
  const parts: string[] = [];

  if (data.skills.length > 0) {
    parts.push(`Skills: ${data.skills.join(", ")}`);
  }

  if (data.experienceLevels.length > 0) {
    parts.push(`Experience: ${data.experienceLevels.join(", ")}`);
  }

  if (data.workLocations.length > 0) {
    parts.push(`Work location: ${data.workLocations.join(", ")}`);
  }

  if (data.idealRoleDescription) {
    parts.push(data.idealRoleDescription);
  }

  return parts.join(" | ");
}

export function formatJobDocument(data: JobDocumentData): string {
  const parts: string[] = [data.title];

  if (data.companyName) {
    parts.push(`Company: ${data.companyName}`);
  }

  if (data.experienceLevel) {
    parts.push(`Level: ${data.experienceLevel}`);
  }

  if (data.workplaceType) {
    parts.push(`Type: ${data.workplaceType}`);
  }

  if (data.city) {
    parts.push(`Location: ${data.city}`);
  }

  if (data.technologies.length > 0) {
    parts.push(`Tech: ${data.technologies.join(", ")}`);
  }

  if (data.salaryFrom && data.salaryTo && data.salaryCurrency) {
    parts.push(
      `Salary: ${data.salaryFrom}-${data.salaryTo} ${data.salaryCurrency}`
    );
  }

  return parts.join(" | ");
}
