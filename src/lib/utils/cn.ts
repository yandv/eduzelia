import type { ClassNameValue } from "tailwind-merge";
import { twMerge } from "tailwind-merge";
import clsx from "clsx";

export function cn(...inputs: ClassNameValue[]) {
  return twMerge(clsx(inputs));
}
