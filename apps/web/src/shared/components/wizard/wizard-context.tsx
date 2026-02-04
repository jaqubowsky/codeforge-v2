"use client";

import { createContext, useContext } from "react";
import type { WizardContextValue } from "./types";

export const WizardContext = createContext<WizardContextValue | null>(null);

export function useWizard() {
  const context = useContext(WizardContext);
  if (!context) {
    throw new Error("useWizard must be used within a Wizard component");
  }
  return context;
}
