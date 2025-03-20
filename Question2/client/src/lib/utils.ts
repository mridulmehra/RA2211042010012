import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines class names with Tailwind's merge functionality
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Generates a random image URL based on a seed string
 * This ensures consistent images for the same entities
 */
export function generateRandomImageUrl(seed: string): string {
  // Using the seed to generate a hash for consistent image generation
  const hash = hashString(seed);
  
  // Use a gender-balanced set of indices (1-100) from UIFaces collection
  // These provide consistent, realistic human photos
  const imageIndex = (hash % 100) + 1;
  
  // Return realistic people photos using a public API
  return `https://randomuser.me/api/portraits/${hash % 2 === 0 ? 'men' : 'women'}/${imageIndex}.jpg`;
}

/**
 * Simple string hash function to convert a string to a number
 */
function hashString(str: string): number {
  let hash = 0;
  if (str.length === 0) return hash;
  
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  
  return Math.abs(hash);
}

/**
 * Format a number with K/M/B suffixes for large numbers
 */
export function formatNumber(num: number): string {
  if (num >= 1_000_000_000) {
    return (num / 1_000_000_000).toFixed(1) + 'B';
  }
  if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(1) + 'M';
  }
  if (num >= 1_000) {
    return (num / 1_000).toFixed(1) + 'K';
  }
  return num.toString();
}

/**
 * Truncate text with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}
