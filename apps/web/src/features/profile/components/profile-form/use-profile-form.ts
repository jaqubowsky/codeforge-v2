"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { updateProfile } from "../../api";
import { type ProfileFormData, profileSchema } from "../../schemas/profile";
import type { ProfileData } from "../../types/profile";

const SUCCESS_MESSAGE = "Profile updated successfully!";
const UNEXPECTED_ERROR_MESSAGE = "An unexpected error occurred";

interface UseProfileFormProps {
  initialData: ProfileData;
}

export function useProfileForm({ initialData }: UseProfileFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: initialData,
    mode: "onChange",
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = form;

  const onSubmit = async (data: ProfileFormData) => {
    setIsSubmitting(true);

    try {
      const result = await updateProfile(data);

      if (!result.success) {
        toast.error(result.error);
        setIsSubmitting(false);
        return;
      }

      toast.success(SUCCESS_MESSAGE);
      setIsSubmitting(false);
    } catch {
      toast.error(UNEXPECTED_ERROR_MESSAGE);
      setIsSubmitting(false);
    }
  };

  return {
    control,
    errors,
    isSubmitting,
    handleSubmit,
    onSubmit,
  };
}
