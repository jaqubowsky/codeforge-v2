"use client";

import { cn } from "@codeforge-v2/ui/lib/utils";
import { Check } from "lucide-react";

interface WizardProgressProps {
  currentStep: number;
  steps: string[];
}

export function WizardProgress({ currentStep, steps }: WizardProgressProps) {
  const getStepClassName = (index: number) => {
    if (index < currentStep) {
      return "border-primary bg-primary text-primary-foreground";
    }
    if (index === currentStep) {
      return "border-primary bg-background text-primary";
    }
    return "border-muted bg-background text-muted-foreground";
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div className="flex flex-1 items-center" key={step}>
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "flex size-10 items-center justify-center rounded-full border-2 transition-colors",
                  getStepClassName(index)
                )}
              >
                {index < currentStep ? (
                  <Check className="size-5" />
                ) : (
                  <span className="font-semibold text-sm">{index + 1}</span>
                )}
              </div>
              <span
                className={cn(
                  "mt-2 font-medium text-xs",
                  index <= currentStep
                    ? "text-foreground"
                    : "text-muted-foreground"
                )}
              >
                {step}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "mx-2 h-0.5 flex-1 transition-colors",
                  index < currentStep ? "bg-primary" : "bg-muted"
                )}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
