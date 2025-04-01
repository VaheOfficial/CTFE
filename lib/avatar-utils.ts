/**
 * Utility functions for generating avatar content locally
 * instead of relying on external services like ui-avatars.com
 */

/**
 * Extracts initials from a name
 * @param name Full name to extract initials from
 * @returns Initials (up to 2 characters)
 */
export function getInitials(name: string): string {
  if (!name) return '?';
  
  const parts = name.split(' ').filter(part => part.length > 0);
  
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  
  // Get first letter of first and last parts
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

/**
 * Generates a consistent color based on a string (name)
 * @param text Input string to derive color from
 * @returns HEX color code
 */
export function getAvatarColor(text: string): string {
  // Default to our theme orange if no text
  if (!text) return '#ff6b00';
  
  // Simple hash function to generate a number from string
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = text.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  // Convert to hex color (keeping it in orange-red range for our theme)
  // This limits the colors to variations of orange/red to match our theme
  const r = 230 + (hash & 25); // Range 230-255 (warm reds)
  const g = 80 + (hash & 75);  // Range 80-155 (moderate greens for orange)
  const b = 0 + (hash & 55);   // Range 0-55 (low blues for orange/red)
  
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
} 