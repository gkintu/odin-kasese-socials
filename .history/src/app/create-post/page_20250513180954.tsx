// src/app/create-post/page.tsx
'use client'; // This page involves client-side logic for auth checks and form handling

import React, { useEffect } from 'react'; // useEffect for redirection logic
import ProtectedRoute from '@/components/Auth/ProtectedRoute';
import { useAuthStore } from '@/lib/store/authStore';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
// We will create CreatePostForm soon
// import CreatePostForm from '@/components/posts/CreatePostForm';
// import { CreatePostFormValues } from '@/components/posts/CreatePostForm'; // Assuming type export

const CreatePostPage: React.FC = () => {
  // Get authentication state and router
  const { isAuthenticated, isGuest, isLoading } = useAuthStore();
  const router = useRouter();

  // Effect to ensure only fully authenticated users can access this page
  useEffect(() => {
    if (!isLoading && (!isAuthenticated || isGuest)) {
      // If not loading, and user is either not authenticated or is a guest,
      // show an error and redirect.
      toast.error('You must be logged in to create a post.');
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, isGuest, router]); // Dependencies for the effect

  // Page Content Logic
  const PageContent: React.FC = () => {
    // Show loading indicator while auth state is being determined
    if (isLoading) {
      return <p className="text-center text-gray-600 mt-10">Loading page...</p>;
    }

    // If user is not authenticated or is a guest (even if ProtectedRoute allows guests for some pages,
    // this page specifically requires full auth). The useEffect above should handle redirection.
    // This is a fallback UI.
    if (!isAuthenticated || isGuest) {
      return (
        <p className="text-center text-gray-700 mt-10">
          Access denied. Please log in.
        </p>
      );
    }

    // If authenticated and not a guest, show the form (placeholder for now)
    return (
      <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8 bg-white shadow-xl rounded-lg">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 text-center">
          Create New Post
        </h1>
        <CreatePostForm onSubmit={() => {}} isSubmitting={false} />
      </div>
    );
  };

  return (
    // Wrap the page content with ProtectedRoute for initial access check
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8 min-h-screen bg-gray-100 flex items-center justify-center">
        <PageContent />
      </div>
    </ProtectedRoute>
  );
};

export default CreatePostPage;
