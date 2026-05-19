/**
 * Utility for Tailwind merges
 */
export function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}
