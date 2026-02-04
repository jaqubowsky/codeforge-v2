export interface LoginFormData {
  email: string;
  password: string;
}

export interface SignupFormData {
  email: string;
  password: string;
  confirmPassword?: string;
}

export type OnboardingFormData = Record<string, never>;
