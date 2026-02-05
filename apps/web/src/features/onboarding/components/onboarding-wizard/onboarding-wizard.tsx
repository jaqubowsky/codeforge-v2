"use client";

import { Wizard, WizardProgress, WizardStep } from "@/shared/components/wizard";
import { WIZARD_STEPS } from "../../constants";
import { useOnboardingForm } from "../../hooks/use-onboarding-form";
import { StepIdealRole } from "../step-ideal-role";
import { StepPreferences } from "../step-preferences";
import { WizardNavigation } from "./wizard-navigation";

export function OnboardingWizard() {
  const {
    control,
    errors,
    isSubmitting,
    handleSubmit,
    onSubmit,
    validatePreferences,
    validateIdealRole,
  } = useOnboardingForm();

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Wizard>
        <WizardStep name="preferences" validate={validatePreferences}>
          <WizardProgress currentStep={0} steps={[...WIZARD_STEPS]} />
          <StepPreferences control={control} errors={errors} />
          <WizardNavigation isSubmitting={isSubmitting} />
        </WizardStep>

        <WizardStep name="ideal-role" validate={validateIdealRole}>
          <WizardProgress currentStep={1} steps={[...WIZARD_STEPS]} />
          <StepIdealRole control={control} errors={errors} />
          <WizardNavigation isSubmitting={isSubmitting} />
        </WizardStep>
      </Wizard>
    </form>
  );
}
