// src/components/layout/Navbar.tsx
'use client'; // This component uses client-side hooks (useAuthStore)

import React from 'react';
import Link from 'next/link'; // For client-side navigation
import { useAuthStore } from '@/lib/store/authStore'; // Our Zustand auth store
import toast from 'react-hot-toast';
import { useRouter, usePathname } from 'next/navigation';

const Navbar: React.FC = () => {
  const { isAuthenticated, isGuest, userEmail, displayName, logout } =
    useAuthStore();
  const router = useRouter();
  const pathname = usePathname(); // Get current path

  const handleLogout = () => {
    logout();
    toast.success(isGuest ? 'Guest session ended' : 'Logged out successfully');
    router.push('/');
  };

  // Do not render Navbar on login or signup pages
  if (pathname === '/login' || pathname === '/signup') {
    return null;
  }

  const displayUsername = displayName || (userEmail ? userEmail.split('@')[0] : '');

  return (
    <nav className="bg-gray-800 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold hover:text-gray-300">
          Kasese SociaLs
        </Link>
        <div className="space-x-4 flex items-center">
          {isAuthenticated && !isGuest ? (
            <>
              <span className="text-sm">
                Welcome, {displayUsername}!
              </span>
              <Link href="/profile" className="hover:text-gray-300">Profile</Link>
              {/* <Link href="/dashboard" className="hover:text-gray-300">Dashboard</Link> */}
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              >
                Logout
              </button>
            </>
          ) : isGuest ? (
            <>
              <span className="text-sm italic">Browse as guest</span>
              <Link
                href="/login"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
              >
                Sign Up
              </Link>
              <button
                onClick={handleLogout} // Ends guest session
                className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded"
              >
                End Guest Session
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
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
