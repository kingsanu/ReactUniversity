"use client";
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useGlobalStore } from '@/store/useGlobalStore';
import { LoadingSpinner } from './LoadingSpinner';

interface AuthWrapperProps {
  children: React.ReactNode;
}

const protectedRoutes = ['/dashboard'];
const authRoutes = ['/login', '/signup'];

export function AuthWrapper({ children }: AuthWrapperProps) {
  const { user, initializeAuth } = useGlobalStore();
  const router = useRouter();
  const pathname = usePathname();
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    // Initialize authentication state from localStorage
    const initialize = async () => {
      await initializeAuth();
      setIsInitializing(false);
    };
    initialize();
  }, [initializeAuth]);

  useEffect(() => {
    // Don't redirect while still initializing
    if (isInitializing) return;

    const isProtectedRoute = protectedRoutes.some(route =>
      pathname.startsWith(route)
    );
    const isAuthRoute = authRoutes.includes(pathname);

    // If user is not authenticated and trying to access protected route
    if (!user.isAuthenticated && isProtectedRoute) {
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }

    // Coach Route Protection
    if (pathname.startsWith('/dashboard/coaching')) {
      // Check if user has coach role (case-insensitive comparison)
      if (!user.role || user.role.toLowerCase() !== 'coach') {
        router.push('/dashboard'); // Redirect non-coaches to main dashboard
        return;
      }

      // Check contract expiry
      if (user.contractEnd) {
        const contractEndDate = new Date(user.contractEnd);
        const today = new Date();
        // Reset time part for accurate date comparison
        today.setHours(0, 0, 0, 0);
        
        if (contractEndDate < today) {
          // Allow access to access-denied page to prevent infinite loop
          if (pathname !== '/dashboard/coaching/access-denied') {
            router.push('/dashboard/coaching/access-denied');
            return;
          }
        }
      }
    }

    // If user is authenticated and trying to access auth routes, redirect to dashboard
    if (user.isAuthenticated && isAuthRoute) {
      router.push('/dashboard');
      return;
    }
  }, [user.isAuthenticated, user.role, user.contractEnd, pathname, router, isInitializing]);

  // Show loading spinner while initializing
  if (isInitializing) {
    return <LoadingSpinner />;
  }

  return <>{children}</>;
}