"use client";

import * as React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./alert-dialog";

interface ConfirmButtonProps {
  children: React.ReactNode;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void | Promise<void>;
  variant?: "default" | "destructive";
  disabled?: boolean;
}

export function ConfirmButton({
  children,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  variant = "default",
  disabled = false,
}: ConfirmButtonProps) {
  const [open, setOpen] = React.useState(false);
  const [isPending, setIsPending] = React.useState(false);

  const handleConfirm = async () => {
    setIsPending(true);
    try {
      await onConfirm();
      setOpen(false);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <AlertDialog onOpenChange={setOpen} open={open}>
      <AlertDialogTrigger asChild disabled={disabled}>
        {children}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>
            {cancelText}
          </AlertDialogCancel>
          <AlertDialogAction
            className={
              variant === "destructive"
                ? "bg-destructive hover:bg-destructive/90"
                : ""
            }
            disabled={isPending}
            onClick={handleConfirm}
          >
            {isPending ? "Loading..." : confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
