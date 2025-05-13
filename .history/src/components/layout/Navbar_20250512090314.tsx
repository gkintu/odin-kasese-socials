// src/components/layout/Navbar.tsx
'use client'; // This component uses client-side hooks (useAuthStore)

import React from 'react';
import Link from 'next/link'; // For client-side navigation
import { useAuthStore } from '@/lib/store/authStore'; // Our Zustand auth store

const Navbar: React.FC = () => {
  // Get authentication and guest state, and logout action
  const { isAuthenticated, userEmail, isGuest, logout } = useAuthStore();

  const handleLogout = () => {
    logout(); // This action now clears both auth and guest states
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
        <div className="space-x-4 flex items-center">
          {isAuthenticated ? (
            // Fully authenticated user
            <>
              {userEmail && <span className="mr-2">Welcome, {userEmail}</span>}
              <Link
                href="/dashboard"
                className="px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-700"
              >
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-indigo-600 focus:ring-white"
              >
                Logout
              </button>
            </>
          ) : isGuest ? (
            // Guest user
            <>
              <span className="mr-2 text-indigo-200">Browse as Guest</span>
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
              {/* A guest might also want to "logout" of their guest session */}
              <button
                onClick={handleLogout}
                className="px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-indigo-600 focus:ring-white"
              >
                End Guest Session
              </button>
            </>
          ) : (
            // Not authenticated and not a guest (logged out)
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
