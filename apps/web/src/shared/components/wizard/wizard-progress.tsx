"use client";

import { Text } from "@codeforge-v2/ui/components/text";
import { cn } from "@codeforge-v2/ui/lib/utils";
import { Check } from "lucide-react";
import { WIZARD_COLORS } from "./wizard-tokens";

interface WizardProgressProps {
  currentStep: number;
  steps: string[];
}

export function WizardProgress({ currentStep, steps }: WizardProgressProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-center gap-2">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          const isUpcoming = index > currentStep;

          return (
            <div className="flex items-center" key={step}>
              <div className="flex flex-col items-center gap-1.5">
                <div
                  className={cn(
                    "flex size-8 items-center justify-center rounded-md font-medium text-xs transition-all duration-300",
                    isCompleted && WIZARD_COLORS.step.completed,
                    isCurrent && WIZARD_COLORS.step.current,
                    isUpcoming && WIZARD_COLORS.step.upcoming
                  )}
                >
                  {isCompleted ? (
                    <Check className="size-4" />
                  ) : (
                    String(index + 1).padStart(2, "0")
                  )}
                </div>
                <Text
                  as="span"
                  className={cn(
                    "whitespace-nowrap transition-colors duration-300",
                    isCurrent && WIZARD_COLORS.label.current,
                    isCompleted && WIZARD_COLORS.label.completed,
                    isUpcoming && WIZARD_COLORS.label.upcoming
                  )}
                  variant="caption"
                >
                  {step}
                </Text>
              </div>

              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "mx-3 mt-[-1.25rem] h-px w-12 transition-colors duration-300",
                    index < currentStep
                      ? WIZARD_COLORS.connector.completed
                      : WIZARD_COLORS.connector.upcoming
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
