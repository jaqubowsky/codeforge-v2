export interface WizardStepProps {
  name: string;
  children: React.ReactNode;
  validate?: () => Promise<boolean> | boolean;
}

export interface WizardContextValue {
  currentStep: number;
  totalSteps: number;
  goToNext: () => Promise<void>;
  goToPrevious: () => void;
  goToStep: (step: number) => void;
  isFirstStep: boolean;
  isLastStep: boolean;
  stepData: Record<string, unknown>;
  setStepData: (stepName: string, data: unknown) => void;
  getStepData: <T>(stepName: string) => T | undefined;
}
