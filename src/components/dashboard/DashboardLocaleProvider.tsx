"use client";

import type { ReactNode } from "react";
import { LocaleProvider } from "@/contexts/LocaleContext";

export function DashboardLocaleProvider({
  children,
}: {
  readonly children: ReactNode;
}) {
  return <LocaleProvider>{children}</LocaleProvider>;
}
