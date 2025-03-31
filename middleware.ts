import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

interface SystemSettings {
  maintenanceMode: boolean;
  debugMode: boolean;
}

// Mock function to get the system settings - in a real app, this would be a database or API call
const getSystemSettings = async (): Promise<SystemSettings> => {
  try {
    // In a production environment, this would be a call to your API or database
    // For demo purposes, we're making a request to our own API endpoint
    const response = await fetch('http://localhost:3000/api/system/settings', {
      cache: 'no-store'
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch system settings');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching system settings:', error);
    // Default values if we can't fetch settings
    return { maintenanceMode: false, debugMode: false };
  }
};

// Function to check if the current user is an admin
// In a real app, this would verify session tokens, roles, etc.
const isAdminUser = (request: NextRequest): boolean => {
  // For demo purposes, we'll consider users accessing from admin paths as admins
  const url = request.nextUrl.pathname;
  return url.startsWith('/admin');
};

export async function middleware(request: NextRequest) {
  // Skip middleware for static files and API routes
  if (
    request.nextUrl.pathname.startsWith('/_next') ||
    request.nextUrl.pathname.startsWith('/static') ||
    request.nextUrl.pathname.startsWith('/api')
  ) {
    return NextResponse.next();
  }

  // Skip middleware for the maintenance page itself
  if (request.nextUrl.pathname === '/maintenance') {
    return NextResponse.next();
  }

  try {
    // Get system settings
    const { maintenanceMode, debugMode } = await getSystemSettings();

    // If maintenance mode is active and user is not an admin, redirect to maintenance page
    if (maintenanceMode && !isAdminUser(request)) {
      return NextResponse.redirect(new URL('/maintenance', request.url));
    }

    // Add debug headers if debug mode is active
    if (debugMode) {
      const response = NextResponse.next();
      response.headers.set('X-Debug-Mode', 'true');
      // In a real app, you might add additional debug information or behaviors
      return response;
    }

    return NextResponse.next();
  } catch (error) {
    console.error('Middleware error:', error);
    return NextResponse.next();
  }
}

// Only run middleware on specific paths
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}; 