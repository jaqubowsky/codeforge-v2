"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { completeOnboarding } from "../api";
import { type OnboardingFormData, onboardingSchema } from "../schemas";

const FORM_DEFAULT_VALUES: OnboardingFormData = {
  jobTitles: [],
  experienceLevel: [],
  preferredLocations: [],
  skills: [],
  idealRoleDescription: "",
};

const VALIDATION_MESSAGES = {
  basicInfo: "Please fill in all required fields correctly",
  skills: "Please select at least 3 skills",
  idealRole: "Please provide a description of at least 50 characters",
  unexpectedError: "An unexpected error occurred",
} as const;

const SUCCESS_MESSAGE = "Welcome to Job Tracker! Your profile is complete.";
const REDIRECT_PATH = "/";

export function useOnboardingForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<OnboardingFormData>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: FORM_DEFAULT_VALUES,
    mode: "onChange",
  });

  const {
    control,
    handleSubmit,
    trigger,
    formState: { errors },
  } = form;

  const validateBasicInfo = async (): Promise<boolean> => {
    const result = await trigger([
      "jobTitles",
      "experienceLevel",
      "preferredLocations",
    ]);
    if (!result) {
      toast.error(VALIDATION_MESSAGES.basicInfo);
    }
    return result;
  };

  const validateSkills = async (): Promise<boolean> => {
    const result = await trigger("skills");
    if (!result) {
      toast.error(VALIDATION_MESSAGES.skills);
    }
    return result;
  };

  const validateIdealRole = async (): Promise<boolean> => {
    const result = await trigger("idealRoleDescription");
    if (!result) {
      toast.error(VALIDATION_MESSAGES.idealRole);
    }
    return result;
  };

  const onSubmit = async (data: OnboardingFormData) => {
    setIsSubmitting(true);

    try {
      const result = await completeOnboarding(data);

      if (!result.success) {
        toast.error(result.error);
        setIsSubmitting(false);
        return;
      }

      toast.success(SUCCESS_MESSAGE);
      router.replace(REDIRECT_PATH);
    } catch {
      toast.error(VALIDATION_MESSAGES.unexpectedError);
      setIsSubmitting(false);
    }
  };

  return {
    control,
    errors,
    isSubmitting,
    handleSubmit,
    onSubmit,
    validateBasicInfo,
    validateSkills,
    validateIdealRole,
  };
}
