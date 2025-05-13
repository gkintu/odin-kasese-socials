// src/app/profile/page.tsx
'use client'; // This page uses client-side hooks for auth state and conditional rendering

import React from 'react';
import ProtectedRoute from '@/components/Auth/ProtectedRoute'; // Our route protection component
import UserProfileDisplay from '@/components/profile/UserProfileDisplay';
import { useAuthStore } from '@/lib/store/authStore'; // Import useAuthStore

// Helper function to extract username from email
const getUsernameFromEmail = (email: string | null): string => {
  if (!email) return 'User';
  return email.split('@')[0];
};

interface PageContentProps {
  isLoading: boolean;
  isAuthenticated: boolean;
  isGuest: boolean;
  userEmail: string | null;
}

// Main component for the profile page content
const PageContent: React.FC<PageContentProps> = ({
  isLoading,
  isAuthenticated,
  isGuest,
  userEmail,
}) => {
  if (isLoading) {
    return (
      <p className="text-center text-gray-600 mt-10">Loading profile...</p>
    );
  }

  if (isGuest) {
    return (
      <div className="text-center p-4">
        <h1 className="text-2xl font-semibold mb-4">Guest Access</h1>
        <p className="text-gray-700 mb-6">
          You are currently viewing as a guest. Please{' '}
          <a href="/login" className="text-indigo-600 hover:underline">
            Login
          </a>{' '}
          or{' '}
          <a href="/signup" className="text-indigo-600 hover:underline">
            Sign Up
          </a>{' '}
          to create and view your profile.
        </p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="text-center p-4">
        <p className="text-red-500">
          You need to be logged in to view this page.
        </p>
        <p>
          Please{' '}
          <a href="/login" className="text-indigo-600 hover:underline">
            login
          </a>
          .
        </p>
      </div>
    );
  }

  // Authenticated user view
  const displayName = getUsernameFromEmail(userEmail);
  const bio = 'This is a default bio. Edit your profile to change it!'; // Default bio
  const avatarUrl = '/img/default-avatar.png'; // Default avatar

  return (
    <div className="container mx-auto px-4 py-8">
      <UserProfileDisplay
        displayName={displayName}
        userEmail={userEmail!}
        bio={bio}
        avatarUrl={avatarUrl}
      />
    </div>
  );
};

// The main ProfilePage component, wrapped by ProtectedRoute
const ProfilePage: React.FC = () => {
  const { isLoading, isAuthenticated, isGuest, userEmail } = useAuthStore(); // Use the store

  return (
    <ProtectedRoute>
      <PageContent
        isLoading={isLoading}
        isAuthenticated={isAuthenticated}
        isGuest={isGuest}
        userEmail={userEmail}
      />
    </ProtectedRoute>
  );
};

export default ProfilePage;
