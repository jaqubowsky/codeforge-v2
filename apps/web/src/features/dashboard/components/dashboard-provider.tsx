"use client";

import { RunNowProvider } from "../context/run-now-context";

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  return <RunNowProvider>{children}</RunNowProvider>;
}
