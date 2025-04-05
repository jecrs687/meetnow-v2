import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * A utility function for conditionally joining class names together.
 * It uses clsx for conditional class merging and tailwind-merge to handle
 * Tailwind CSS class conflicts properly.
 * 
 * @param inputs - Class names or conditional class objects to merge
 * @returns - A merged class string with properly handled Tailwind conflicts
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
