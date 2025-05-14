// src/app/profile/edit/page.tsx
'use client'; // Uses client-side hooks for auth and form handling

import React from 'react';
import ProtectedRoute from '@/components/Auth/ProtectedRoute';
import { useAuthStore } from '@/lib/store/authStore';
import { useRouter } from 'next/navigation';
import EditProfileForm from '@/components/profile/EditProfileForm';
import type { EditProfileFormValues } from '@/components/profile/EditProfileForm';
import toast from 'react-hot-toast';

const EditProfilePage = () => {
  const {
    isAuthenticated,
    isGuest,
    userEmail,
    isLoading,
    displayName,
    updateDisplayName,
  } = useAuthStore();
  const router = useRouter();

  const handleEditProfileSubmit = async (data: EditProfileFormValues) => {
    if (!isAuthenticated || isGuest) {
      toast.error('Access denied. Please log in.');
      router.push('/login');
      return;
    }

    const submissionPromise = new Promise<void>((resolve) => {
      setTimeout(() => {
        // Simulate API call

        // Only update if display name has changed
        if (
          data.displayName &&
          data.displayName !== displayName &&
          data.displayName !== userEmail?.split('@')[0]
        ) {
          updateDisplayName(data.displayName);
        }
        resolve();
      }, 1000);
    });

    await toast.promise(submissionPromise, {
      loading: 'Updating profile...',
      success: () => {
        router.push('/profile');
        return 'Profile updated successfully! (Dummy)';
      },
      error: 'Failed to update profile. (Dummy)',
    });
  };

  if (isLoading) {
    return <p className="text-center text-gray-700 mt-10">Loading...</p>;
  }

  if (!isAuthenticated || isGuest) {
    return (
      <p className="text-center text-gray-700 mt-10">Access restricted.</p>
    );
  }

  const initialData = {
    displayName: displayName || userEmail?.split('@')[0] || '',
    bio: 'This is my current Kasese Socials bio. I love connecting with people and sharing my thoughts!',
    profilePictureUrl: '/img/avatars/jane.png',
  };

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Edit Your Profile
        </h1>
        <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg p-6">
          <EditProfileForm
            onSubmit={handleEditProfileSubmit}
            initialData={initialData}
          />
          <p className="mt-6 text-sm text-center text-gray-500">
            Changes to your profile will be visible to other users.
            <br />
            Your email address ({userEmail}) is private and will not be shown.
          </p>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default EditProfilePage;
