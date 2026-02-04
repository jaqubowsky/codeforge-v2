"use client";

import { Button } from "@codeforge-v2/ui/components/button";
import { useWizard } from "@/shared/components/wizard";

interface WizardNavigationProps {
  isSubmitting: boolean;
}

export function WizardNavigation({ isSubmitting }: WizardNavigationProps) {
  const { goToPrevious, goToNext, isFirstStep, isLastStep } = useWizard();

  return (
    <div className="flex gap-3">
      {!isFirstStep && (
        <Button
          disabled={isSubmitting}
          onClick={goToPrevious}
          type="button"
          variant="outline"
        >
          Back
        </Button>
      )}
      {isLastStep ? (
        <Button className="flex-1" disabled={isSubmitting} type="submit">
          {isSubmitting ? "Completing..." : "Complete Onboarding"}
        </Button>
      ) : (
        <Button
          className="flex-1"
          disabled={isSubmitting}
          onClick={goToNext}
          type="button"
        >
          Next
        </Button>
      )}
    </div>
  );
}
