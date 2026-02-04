export type YearsExperience = "0-1" | "1-3" | "3-5" | "5-10" | "10+";

export interface BasicInfoData {
  jobTitle: string;
  yearsExperience: YearsExperience;
}

export interface SkillsData {
  skills: string[];
}

export interface IdealRoleData {
  idealRoleDescription: string;
}

export interface OnboardingData {
  basicInfo: BasicInfoData;
  skills: SkillsData;
  idealRole: IdealRoleData;
}

export interface Technology {
  id: number;
  name: string;
}
