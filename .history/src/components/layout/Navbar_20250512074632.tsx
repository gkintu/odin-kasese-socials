// src/components/layout/Navbar.tsx
'use client'; // This component uses client-side hooks (useAuthStore)

import React from 'react';
import Link from 'next/link'; // For client-side navigation
import { useAuthStore } from '@/lib/store/authStore'; // Our Zustand auth store

const Navbar: React.FC = () => {
  // Get authentication state and actions from the store
  const { isAuthenticated, userEmail, logout } = useAuthStore();

  // Handler for the logout button
  const handleLogout = () => {
    logout(); // Call the logout action from the store
    // Optionally, redirect the user or show a notification
    // For now, the store handles state change, and alert was in previous component
  };

  return (
    // Basic navbar styling with Tailwind CSS
    <nav className="bg-indigo-600 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo/Brand Name - links to homepage */}
        <Link href="/" className="text-xl font-bold hover:text-indigo-200">
          Kasese Socials
        </Link>

        {/* Navigation links based on authentication state */}
        <div className="space-x-4">
          {isAuthenticated ? (
            // If authenticated, show user email and Logout button
            <>
              {userEmail && (
                // Display user's email
                <span className="mr-4">Welcome, {userEmail}</span>
              )}
              {/* Logout button */}
              <button
                onClick={handleLogout}
                className="px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-indigo-600 focus:ring-white"
              >
                Logout
              </button>
              {/* Optionally, add a link to a dashboard or profile */}
              <Link
                href="/dashboard"
                className="px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-700"
              >
                Dashboard
              </Link>
            </>
          ) : (
            // If not authenticated, show Login and Sign Up links
            <>
              <Link
                href="/login"
                className="px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-700"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-700"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
