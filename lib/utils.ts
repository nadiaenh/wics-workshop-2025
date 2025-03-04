/**
 * Utility Functions
 * 
 * This module provides utility functions used throughout the application.
 */

import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Combines and merges CSS class names using clsx and tailwind-merge
 * This utility helps prevent class name conflicts and duplicates when using Tailwind CSS
 * 
 * @param inputs - Array of class names or conditional class objects
 * @returns Merged and optimized class string
 * 
 * @example
 * cn("px-4 py-2", { "bg-blue-500": isActive }, "hover:bg-blue-600")
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
