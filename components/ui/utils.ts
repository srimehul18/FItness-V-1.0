// components/ui/utils.ts
import { twMerge } from "tailwind-merge";
import clsx from "clsx";

/**
 * cn: className helper used by shadcn-style components
 * combines clsx and tailwind-merge to dedupe classes
 */
export function cn(...inputs: Parameters<typeof clsx>) {
  return twMerge(clsx(...inputs));
}

export default cn;
