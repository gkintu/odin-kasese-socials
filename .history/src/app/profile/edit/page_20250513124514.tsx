// src/app/profile/edit/page.tsx
'use client'; // Uses client-side hooks for auth and form handling

import React, { useEffect } from 'react';
import ProtectedRoute from '@/components/Auth/ProtectedRoute';
import { useAuthStore } from '@/lib/store/authStore';
import { useRouter } from 'next/navigation';
import EditProfileForm, { EditProfileFormValues } from '@/components/profile/EditProfileForm';
import toast from 'react-hot-toast';

const EditProfilePage: React.FC = () => {
  const { isAuthenticated, isGuest, userEmail, isLoading, displayName, updateDisplayName } = useAuthStore();
  const router = useRouter();

  // Redirect if not properly authenticated (client-side check)
  useEffect(() => {
    if (!isLoading && (!isAuthenticated || isGuest)) {
      toast.error('Access denied. Please log in.');
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, isGuest, router]);

  const handleEditProfileSubmit = async (data: EditProfileFormValues) => {
    console.log('Updating profile with (dummy):', data);

    // Simulate API call for saving data
    toast.loading('Saving profile...', { id: 'saving-profile' });
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay

    // Update display name in Zustand store if it has changed
    if (data.displayName && data.displayName !== (displayName || userEmail?.split('@')[0])) {
      updateDisplayName(data.displayName); // Update store
    }

    // Dismiss loading toast
    toast.dismiss('saving-profile');
    toast.success('Profile updated successfully! (Dummy)');
    router.push('/profile'); // Navigate back to the profile page
  };

  // Actual Page Content to render if checks pass
  const PageContent: React.FC = () => {
    if (isLoading) {
      return <p className="text-center text-gray-600 mt-10">Loading...</p>;
    }

    // This check is crucial. If user is not authenticated or is a guest, they shouldn't see the form.
    if (!isAuthenticated || isGuest) {
      // This message might be briefly visible before redirect.
      return <p className="text-center text-gray-700 mt-10">Access restricted.</p>;
    }

    // Prepare initial data for the form
    // Fallback for displayName if null in store: derive from email
    const initialDisplayName = displayName || userEmail?.split('@')[0] || '';
    // Dummy bio for now, as we don't store it in authStore yet.
    // In a real app, this would come from user's data fetched from backend.
    const initialBio = "This is my current Kasese Socials bio. I love connecting with people and sharing my thoughts!";

    return (
      <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8 bg-white shadow-xl rounded-lg">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-8 text-center">Edit Your Profile</h1>
        <EditProfileForm
          onSubmit={handleEditProfileSubmit}
          initialData={{
            displayName: initialDisplayName,
            bio: initialBio, // Pass dummy initial bio
          }}
        />
      </div>
    );
  };

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8 min-h-screen bg-gray-100 flex items-center justify-center"> {/* Centering content */}
        <PageContent />
      </div>
    </ProtectedRoute>
  );
};

export default EditProfilePage;