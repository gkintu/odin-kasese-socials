// src/app/profile/page.tsx
'use client'; // This page uses client-side hooks for auth state and conditional rendering

import React from 'react';
import ProtectedRoute from '@/components/Auth/ProtectedRoute'; // Our route protection component
import { useAuthStore } from '@/lib/store/authStore';       // Zustand store for auth state
// We will create and import UserProfileDisplay soon
// import UserProfileDisplay from '@/components/profile/UserProfileDisplay';

const ProfilePage: React.FC = () => {
  // Get relevant state from the auth store
  const { isAuthenticated, isGuest, userEmail, isLoading } = useAuthStore();

  // Define the content to be rendered based on auth state
  const PageContent: React.FC = () => {
    if (isLoading) {
      // If auth state is still loading (e.g. from ProtectedRoute or initial load)
      return <p className="text-center text-gray-600 mt-10">Loading profile...</p>;
    }

    if (isGuest) {
      // If the user is a guest
      return (
        <div className="text-center text-gray-700 mt-10 p-6 bg-white shadow-md rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Guest Access</h2>
          <p>This is your personal profile area.</p>
          <p>Please <a href="/login" className="text-indigo-600 hover:underline">Login</a> or <a href="/signup" className="text-indigo-600 hover:underline">Sign Up</a> to create and view your profile.</p>
        </div>
      );
    }

    if (isAuthenticated && userEmail) {
      // If the user is fully authenticated
      // Placeholder for UserProfileDisplay component
      // return <UserProfileDisplay userEmail={userEmail} bio="This is a dummy bio." avatarUrl="/path/to/dummy-avatar.png" />;
      return (
        <div className="text-center mt-10 p-6 bg-white shadow-md rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Welcome to your Profile, {userEmail}!</h2>
          <p>(UserProfileDisplay component will go here)</p>
        </div>
      );
    }

    // Fallback for users who are not authenticated, not guests, and not loading
    // This case should ideally be handled by ProtectedRoute redirecting to /login,
    // but as a safe fallback within the page:
    return (
        <div className="text-center text-gray-700 mt-10 p-6 bg-white shadow-md rounded-lg">
            <p>You need to be logged in to view this page.</p>
            <p>Redirecting to <a href="/login" className="text-indigo-600 hover:underline">login</a>...</p>
            {/* In a real scenario, ProtectedRoute handles the redirect. This is a visual fallback. */}
        </div>
    );
  };

  return (
    // Wrap the entire page content with ProtectedRoute
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8">
        <PageContent />
      </div>
    </ProtectedRoute>
  );
};

export default ProfilePage;