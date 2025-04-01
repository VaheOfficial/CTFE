/**
 * Gets the callback URL from the query parameters
 * @param url The URL object or string containing query parameters
 * @returns The callback URL or '/dashboard' as a default
 */
export function getCallbackUrl(url: URL | string): string {
  try {
    let callbackUrl: string | null = null;
    
    // Handle different input types
    if (typeof url === 'string') {
      // If it's just a query string without the URL part
      if (url.startsWith('?') || !url.includes('://')) {
        const params = new URLSearchParams(url);
        callbackUrl = params.get('callbackUrl');
      } else {
        // It's a full URL
        const urlObj = new URL(url);
        callbackUrl = urlObj.searchParams.get('callbackUrl');
      }
    } else {
      // It's already a URL object
      callbackUrl = url.searchParams.get('callbackUrl');
    }
    
    if (callbackUrl) {
      // Make sure we decode the URL if needed
      // But avoid double-decoding by checking if it contains % characters
      const decodedUrl = callbackUrl.includes('%') 
        ? decodeURIComponent(callbackUrl) 
        : callbackUrl;
      
      // Only use internal URLs to prevent open redirect vulnerabilities
      if (decodedUrl.startsWith('/') && !decodedUrl.startsWith('//')) {
        return decodedUrl;
      }
    }
  } catch (error) {
    console.error('Error processing callback URL:', error);
  }
  
  // Default redirect if no valid callback URL is found
  return '/dashboard';
}

/**
 * Sets a token in the cookies
 * @param token The authentication token to set
 * @param days Number of days until the token expires, undefined for session cookie
 */
export function setAuthCookie(token: string, days?: number): void {
  if (days) {
    const expires = new Date();
    expires.setDate(expires.getDate() + days);
    document.cookie = `token=${token}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
  } else {
    // Create a session cookie (expires when browser is closed)
    document.cookie = `token=${token}; path=/; SameSite=Lax`;
  }
}

/**
 * Removes the authentication token from cookies
 */
export function removeAuthCookie(): void {
  document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Lax';
} 