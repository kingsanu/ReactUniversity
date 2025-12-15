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

    // Subscription Enforcement for Students
    // After registration, new students must purchase a subscription to access the platform
    // Skip check for:
    // 1. Non-protected routes
    // 2. Subscription/Payment related pages (to avoid infinite loops)
    // 3. Admin/Coach users (they don't need subscriptions)
    // 4. Onboarding pages
    const isSubscriptionPage = pathname.startsWith('/dashboard/subscriptions') || 
                               pathname.startsWith('/dashboard/admin/plans') ||
                               pathname.startsWith('/payment-success') ||
                               pathname.startsWith('/payment-cancelled');
    
    const isOnboardingPage = pathname.startsWith('/onboarding');
    
    // Check if user is a student (default role for regular users)
    const userRole = user.role?.toLowerCase() || '';
    const isStudent = !userRole || 
                     userRole === 'student' || 
                     userRole === 'user' || 
                     (!userRole.includes('admin') && !userRole.includes('coach'));
    
    // Enforce subscription for students
    // Note: subscriptionStatus can be null/undefined for new users or 'none' if never subscribed
    if (
      user.isAuthenticated && 
      isProtectedRoute && 
      isStudent && 
      !isSubscriptionPage &&
      !isOnboardingPage &&
      (!user.subscriptionStatus || user.subscriptionStatus === 'none' || user.subscriptionStatus === 'canceled' || user.subscriptionStatus === 'past_due')
    ) {
      // New users and users without active subscriptions must subscribe
      console.log('🔒 Subscription required. Redirecting to subscription page...', {
        subscriptionStatus: user.subscriptionStatus,
        role: user.role,
        pathname
      });
      router.push('/dashboard/subscriptions');
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