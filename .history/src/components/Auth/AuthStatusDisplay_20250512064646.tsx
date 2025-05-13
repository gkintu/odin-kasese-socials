// src/components/Auth/AuthStatusDisplay.tsx
'use client'; // This component uses client-side hooks from Zustand

import React from 'react';
import { useAuthStore } from '@/lib/store/authStore'; // Adjust path as needed

const AuthStatusDisplay: React.FC = () => {
  // Subscribe to auth state from Zustand store
  const { isAuthenticated, userEmail, logout, isLoading } = useAuthStore();

  // Handler for logout button click
  const handleLogout = () => {
    logout(); // Call the logout action from the store
    alert('You have been logged out.'); // Provide feedback
  };

  // If still loading initial auth state or during login, show loading
  if (isLoading && !isAuthenticated) {
    // Check !isAuthenticated to avoid showing "Loading..." if already logged in and something else loads
    return (
      <div className="p-4 text-sm text-gray-600">Loading auth status...</div>
    );
  }

  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow">
      {isAuthenticated ? (
        // If authenticated, show welcome message and logout button
        <div>
          <p className="text-green-700">Welcome, {userEmail}!</p>
          <button
            onClick={handleLogout}
            className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      ) : (
        // If not authenticated, show login prompt
        <p className="text-red-700">You are not logged in.</p>
        // We would typically have a "Login" link/button here that navigates to /login
      )}
    </div>
  );
};

export default AuthStatusDisplay;
