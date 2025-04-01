import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define paths that don't require authentication
const publicPaths = [
  '/login',
  '/register',
  '/access-denied',
  '/forgot-password',
  '/reset-password',
  '/_next',
  '/api/auth', // Auth-related API routes
  '/images',   // Static assets
  '/favicon.ico'
];

// Check if the path is public
const isPublicPath = (path: string) => {
  return publicPaths.some(publicPath => {
    return path === publicPath || path.startsWith(`${publicPath}/`);
  });
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Allow access to public paths without authentication
  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  // Check for authentication token in cookies
  const authToken = request.cookies.get('token')?.value;
  const isAuthenticated = !!authToken;

  // If not authenticated, redirect to login page
  if (!isAuthenticated) {
    const loginUrl = new URL('/login', request.url);
    
    // Add the original URL as a query parameter for redirection after login
    // Don't encode it here - we'll handle encoding/decoding in the auth-utils
    loginUrl.searchParams.set('callbackUrl', pathname);
    
    return NextResponse.redirect(loginUrl);
  }

  // User is authenticated, allow access
  return NextResponse.next();
}

// Configure which paths should trigger this middleware
export const config = {
  matcher: [
    // Match all paths except for static files, api routes that handle their own auth
    // Exclude api routes that handle their own auth
    '/((?!_next/static|_next/image|favicon.ico|api/).*)',
  ],
}; 