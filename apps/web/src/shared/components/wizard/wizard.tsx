"use client";

import { Children, isValidElement, useCallback, useState } from "react";
import { WizardContext } from "./wizard-context";

interface WizardStepProps {
  name: string;
  children: React.ReactNode;
  validate?: () => Promise<boolean> | boolean;
}

interface WizardProps {
  children: React.ReactNode;
  onComplete?: (data: Record<string, unknown>) => void | Promise<void>;
  initialStep?: number;
}

export function Wizard({ children, onComplete, initialStep = 0 }: WizardProps) {
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [stepData, setStepDataState] = useState<Record<string, unknown>>({});

  const steps = Children.toArray(children).filter(
    (child): child is React.ReactElement<WizardStepProps> =>
      isValidElement(child) && child.type === WizardStep
  );

  const totalSteps = steps.length;
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === totalSteps - 1;

  const setStepData = useCallback((stepName: string, data: unknown) => {
    setStepDataState((prev) => ({
      ...prev,
      [stepName]: data,
    }));
  }, []);

  const getStepData = useCallback(
    <T,>(stepName: string): T | undefined => {
      return stepData[stepName] as T | undefined;
    },
    [stepData]
  );

  const goToNext = useCallback(async () => {
    const currentStepElement = steps[currentStep];
    if (currentStepElement?.props.validate) {
      const isValid = await currentStepElement.props.validate();
      if (!isValid) {
        return;
      }
    }

    if (isLastStep) {
      await onComplete?.(stepData);
    } else {
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps - 1));
    }
  }, [currentStep, isLastStep, onComplete, stepData, steps, totalSteps]);

  const goToPrevious = useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  }, []);

  const goToStep = useCallback(
    (step: number) => {
      setCurrentStep(Math.max(0, Math.min(step, totalSteps - 1)));
    },
    [totalSteps]
  );

  const contextValue = {
    currentStep,
    totalSteps,
    goToNext,
    goToPrevious,
    goToStep,
    isFirstStep,
    isLastStep,
    stepData,
    setStepData,
    getStepData,
  };

  return (
    <WizardContext.Provider value={contextValue}>
      <div>{steps[currentStep]}</div>
    </WizardContext.Provider>
  );
}

export function WizardStep({ children }: WizardStepProps) {
  return <div className="space-y-0">{children}</div>;
}
