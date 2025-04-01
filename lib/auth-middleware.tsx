'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import type { RootState } from '../redux/store';
import { UnauthorizedAction } from '../components/unauthorized-action';
import { toast } from 'sonner';

// Higher order component to protect routes
export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  options?: {
    requireAdmin?: boolean;
    redirectTo?: string;
  }
) {
  return function AuthenticatedComponent(props: P) {
    const router = useRouter();
    const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
    const userRole = useSelector((state: RootState) => state.user.user?.role);
    const { requireAdmin = false, redirectTo = '/login' } = options || {};
    
    const isAdmin = userRole === 'admin';
    const hasRequiredPermissions = requireAdmin ? isAdmin : true;
    
    useEffect(() => {
      // If not authenticated, redirect to login page
      if (!isAuthenticated) {
        router.push(redirectTo);
      }
    }, [isAuthenticated, router, redirectTo]);
    
    // Show loading state while checking authentication
    if (!isAuthenticated) {
      return null; // Will redirect due to the useEffect
    }
    
    // If admin access is required but user is not admin, show unauthorized component
    if (requireAdmin && !isAdmin) {
        
      return (
        <div className="flex items-center justify-center h-full bg-red-950 animate-pulse">
            <UnauthorizedAction 
            message="ADMIN ACCESS REQUIRED"
            description="You do not have permission to access this area. This area requires administrative privileges. Incident will be reported."
            actionText="Return to Dashboard"
            actionLink="/dashboard"
            />
        </div>
      );
    }
    
    // If user has required permissions, render the component
    return <Component {...props} />;
  };
}

// Higher order component to protect admin routes
export function withAdminAuth<P extends object>(Component: React.ComponentType<P>) {
  return withAuth(Component, { requireAdmin: true, redirectTo: '/login' });
} 