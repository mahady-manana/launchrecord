import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Generate a URL-safe slug from a string.
 * Enforces allowed characters only: [A-Za-z0-9_-]
 * @param input - The string to slugify
 * @returns A URL-safe slug
 */
export function generateSlug(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove all non-word chars except spaces and hyphens
    .replace(/[\s_]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
}

/**
 * Generate a unique slug for a product.
 * Ensures uniqueness by appending -2, -3, etc. if slug already exists.
 * @param baseSlug - The base slug to start with
 * @param checkExistsFn - Function to check if a slug exists
 * @returns A unique slug
 */
export async function generateUniqueSlug(
  baseSlug: string,
  checkExistsFn: (slug: string) => Promise<boolean>
): Promise<string> {
  const slug = generateSlug(baseSlug)
  
  // Check if slug is unique
  const exists = await checkExistsFn(slug)
  
  if (!exists) {
    return slug
  }
  
  // Slug exists, find next available number
  let counter = 2
  let uniqueSlug = `${slug}-${counter}`
  
  while (await checkExistsFn(uniqueSlug)) {
    counter++
    uniqueSlug = `${slug}-${counter}`
  }
  
  return uniqueSlug
}
