// src/components/layout/Navbar.tsx
'use client';

import Link from 'next/link';
import { useAuthStore } from '@/lib/store/authStore';
import toast from 'react-hot-toast';
import { useRouter, usePathname } from 'next/navigation';

const Navbar = (): JSX.Element => {
  const {
    isAuthenticated,
    isGuest,
    userEmail,
    displayName,
    logout
  } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    const message = isGuest ? 'Guest session ended' : 'Logged out successfully';
    logout();
    toast.success(message);
    router.push('/');
  };

  if (pathname === '/login' || pathname === '/signup') {
    return null;
  }

  const displayUsername =
    displayName || (userEmail ? userEmail.split('@')[0] : '');

  return (
    <nav className="bg-gray-800 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold hover:text-gray-300">
          Kasese SociaLs
        </Link>
        <div className="space-x-4 flex items-center">
          {isAuthenticated && !isGuest ? (
            <>
              <span className="text-sm">Welcome, {displayUsername}!</span>
              <Link href="/profile" className="hover:text-gray-300">
                Profile
              </Link>
              <Link href="/profile/edit" className="hover:text-gray-300">
                Edit Profile
              </Link>
              <Link href="/dashboard" className="hover:text-gray-300">
                Dashboard
              </Link>
              <Link
                href="/users"
                className="px-2 py-1 md:px-3 md:py-2 rounded-md text-xs md:text-sm font-medium hover:bg-indigo-700"
              >
                Discover
              </Link>
              <button
                onClick={handleLogout}
                aria-label="Logout"
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              >
                Logout
              </button>
            </>
          ) : isGuest ? (
            <>
              <span className="text-sm italic">Browse as guest</span>
              <Link
                href="/users"
                className="px-2 py-1 md:px-3 md:py-2 rounded-md text-xs md:text-sm font-medium hover:bg-indigo-700"
              >
                Discover Users
              </Link>
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
                onClick={handleLogout}
                aria-label="End guest session"
                className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded"
              >
                End Guest Session
              </button>
            </>
          ) : (
            // Not authenticated, not guest
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
