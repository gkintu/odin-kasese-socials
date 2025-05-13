'use client'; // Uses client-side hooks

import React, { useEffect } from 'react';
import { useAuthStore } from '@/lib/store/authStore'; // Zustand auth store
import { useRouter } from 'next/navigation'; // Next.js router for redirection

// Define props for ProtectedRoute, expecting children to render
interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  // Get authentication state, guest status, and loading status from the store
  const { isAuthenticated, isGuest, isLoading } = useAuthStore();
  // Get the router instance
  const router = useRouter();

  // useEffect to handle redirection based on auth state changes
  useEffect(() => {
    // If authentication status is still loading, do nothing yet
    if (isLoading) {
      return;
    }

    // If not loading, and user is neither authenticated nor a guest, redirect to login
    if (!isAuthenticated && !isGuest) {
      router.push('/login'); // Redirect to /login
    }
    // No 'else' needed: if authenticated or a guest, the component will render children
  }, [isAuthenticated, isGuest, isLoading, router]); // Dependencies for useEffect

  // While loading authentication status, show a loading indicator
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-xl text-gray-600">Loading application...</p>
        {/* You could add a spinner component here */}
      </div>
    );
  }

  // If authenticated OR a guest, and not loading, render the children (the protected content)
  // NOTE: For Phase 1, we are allowing guests to access the same routes as authenticated users.
  // In a real application, guest access would likely be more restricted to specific pages.
  if ((isAuthenticated || isGuest) && !isLoading) {
    return <>{children}</>;
  }

  // If not authenticated and not loading (should be caught by useEffect for redirection,
  // but as a fallback or for the brief moment before redirect, render null or loading)
  // Or, more simply, this state means the redirect should have happened.
  // Rendering null is fine as the redirect will occur.
  return null;
};

export default ProtectedRoute;
