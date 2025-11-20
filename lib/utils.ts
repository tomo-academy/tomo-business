import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getPlatformIcon = (platform: string) => {
  // In a real app, mapping these to Lucide icons or SVGs is ideal.
  // For now, returning generic mapping keys for components to consume.
  return platform.toLowerCase();
};