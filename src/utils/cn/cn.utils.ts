import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines clsx and tailwind-merge for better className handling
 * - clsx: Conditionally constructs className strings
 * - tailwind-merge: Merges Tailwind CSS classes without conflicts
 *
 * @example
 * cn("px-2 py-1", "p-3") // => "p-3"
 * cn("text-red-500", condition && "text-blue-500") // => "text-red-500" or "text-blue-500"
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
