"use client";

import { createContext, useContext } from "react";

interface WizardContextValue {
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

export const WizardContext = createContext<WizardContextValue | null>(null);

export function useWizard() {
  const context = useContext(WizardContext);
  if (!context) {
    throw new Error("useWizard must be used within a Wizard component");
  }
  return context;
}
