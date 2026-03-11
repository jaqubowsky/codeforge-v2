"use client";

import { Button } from "@codeforge-v2/ui/components/button";
import { cn } from "@codeforge-v2/ui/lib/utils";
import { ArrowLeft, ArrowRight, Check, Loader2 } from "lucide-react";
import { useWizard } from "@/shared/components/wizard";
import { WIZARD_COLORS } from "@/shared/components/wizard/wizard-tokens";

interface WizardNavigationProps {
  isSubmitting: boolean;
}

export function WizardNavigation({ isSubmitting }: WizardNavigationProps) {
  const { goToPrevious, goToNext, isFirstStep, isLastStep } = useWizard();

  return (
    <div
      className={cn(
        "mt-8 flex items-center gap-3 border-t pt-6",
        WIZARD_COLORS.navigation.border
      )}
    >
      {!isFirstStep && (
        <Button
          className="gap-2"
          disabled={isSubmitting}
          onClick={goToPrevious}
          type="button"
          variant="ghost"
        >
          <ArrowLeft className="size-4" />
          Back
        </Button>
      )}
      <div className="flex-1" />
      {isLastStep ? (
        <Button
          className={cn("gap-2", WIZARD_COLORS.navigation.complete)}
          data-umami-event="onboarding-complete"
          disabled={isSubmitting}
          type="submit"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Completing...
            </>
          ) : (
            <>
              Complete
              <Check className="size-4" />
            </>
          )}
        </Button>
      ) : (
        <Button
          className="gap-2"
          disabled={isSubmitting}
          onClick={goToNext}
          type="button"
          variant="dark"
        >
          Continue
          <ArrowRight className="size-4" />
        </Button>
      )}
    </div>
  );
}
