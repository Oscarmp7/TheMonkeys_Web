"use client";
import { LayoutGroup } from "motion/react";

export function LayoutProvider({ children }: { children: React.ReactNode }) {
  return <LayoutGroup>{children}</LayoutGroup>;
}
