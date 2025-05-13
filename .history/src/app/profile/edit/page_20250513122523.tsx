// src/app/profile/edit/page.tsx
'use client'; // Uses client-side hooks for auth and form handling

import React from 'react';
import ProtectedRoute from '@/components/Auth/ProtectedRoute';
import { useAuthStore } from '@/lib/store/authStore';
import { useRouter } from 'next/navigation';
// We will create EditProfileForm soon
// import EditProfileForm from '@/components/profile/EditProfileForm';
// import { EditProfileFormValues } from '@/components/profile/EditProfileForm'; // Assuming type export
import toast from 'react-hot-toast';

const EditProfilePage: React.FC = () => {
  // Get auth state and router
  const { isAuthenticated, isGuest, userEmail, isLoading, displayName, updateDisplayName } = useAuthStore();
  const router = useRouter();

  // Define the actual page content logic
  const PageContent: React.FC = () => {
    // Handle loading state from auth store
    if (isLoading) {
      return <p className="text-center text-gray-600 mt-10">Loading...</p>;
    }

    // Ensure user is fully authenticated (not guest)
    if (!isAuthenticated || isGuest) {
      // This should ideally be caught by ProtectedRoute, but as an extra check or for direct navigation attempts
      toast.error('You must be logged in to edit your profile.');
      // Redirect if not already handled by ProtectedRoute (useEffect can be more robust for this)
      if (typeof window !== 'undefined') { // Ensure router.push is called client-side
        router.push('/login');
      }
      return <p className="text-center text-gray-700 mt-10">Redirecting to login...</p>;
    }

    // Dummy handler for form submission
    const handleEditProfile = async (data: any /* EditProfileFormValues */) => {
      console.log('Updating profile with (dummy):', data);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Update display name in Zustand store if it has changed
      if (data.displayName && data.displayName !== displayName) {
        updateDisplayName(data.displayName);
      }
      
      toast.success('Profile updated successfully! (Dummy)');
      router.push('/profile'); // Navigate back to the profile page
    };
    
    // Placeholder for the form - replace with actual EditProfileForm
    return (
      <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8 bg-white shadow-xl rounded-lg">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">Edit Your Profile</h1>
        {/* <EditProfileForm
          onSubmit={handleEditProfile}
          initialData={{
            displayName: displayName || userEmail?.split('@')[0] || '', // Provide initial display name
            bio: 'Current dummy bio from database/store...', // Provide initial bio
          }}
        /> */}
        <p>(EditProfileForm will go here)</p>
        <p>Initial Display Name (from store): {displayName || userEmail?.split('@')[0] || 'N/A'}</p>
        <p>Initial Bio (dummy): Current dummy bio...</p>
      </div>
    );
  };

  return (
    // Wrap with ProtectedRoute
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8 min-h-screen bg-gray-100">
        <PageContent />
      </div>
    </ProtectedRoute>
  );
};

export default EditProfilePage;