"use client";

import { Wizard, WizardProgress, WizardStep } from "@/shared/components/wizard";
import { WIZARD_STEPS } from "../../constants";
import { useOnboardingForm } from "../../hooks/use-onboarding-form";
import { StepBasicInfo } from "../step-basic-info";
import { StepIdealRole } from "../step-ideal-role";
import { StepSkills } from "../step-skills";
import { WizardNavigation } from "./wizard-navigation";

export function OnboardingWizard() {
  const {
    control,
    errors,
    isSubmitting,
    handleSubmit,
    onSubmit,
    validateBasicInfo,
    validateSkills,
    validateIdealRole,
  } = useOnboardingForm();

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Wizard>
        <WizardStep name="basic-info" validate={validateBasicInfo}>
          <WizardProgress currentStep={0} steps={[...WIZARD_STEPS]} />
          <StepBasicInfo control={control} errors={errors} />
          <WizardNavigation isSubmitting={isSubmitting} />
        </WizardStep>

        <WizardStep name="skills" validate={validateSkills}>
          <WizardProgress currentStep={1} steps={[...WIZARD_STEPS]} />
          <StepSkills control={control} errors={errors} />
          <WizardNavigation isSubmitting={isSubmitting} />
        </WizardStep>

        <WizardStep name="ideal-role" validate={validateIdealRole}>
          <WizardProgress currentStep={2} steps={[...WIZARD_STEPS]} />
          <StepIdealRole control={control} errors={errors} />
          <WizardNavigation isSubmitting={isSubmitting} />
        </WizardStep>
      </Wizard>
    </form>
  );
}
