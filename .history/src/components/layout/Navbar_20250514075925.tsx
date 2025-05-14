// src/components/layout/Navbar.tsx
'use client';

import React, { Fragment } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/lib/store/authStore';
import toast from 'react-hot-toast';
import { useRouter, usePathname } from 'next/navigation';
import { Menu, Transition } from '@headlessui/react';
import Image from 'next/image';

const Navbar: React.FC = () => {
  const { isAuthenticated, isGuest, userEmail, displayName, logout } =
    useAuthStore();
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

  const userAvatarForDropdown = '/img/default-avatar.png';

  return (
    <nav className="bg-indigo-600 text-white p-4 shadow-md sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold hover:text-indigo-200">
          Kasese Socials
        </Link>
        <div className="space-x-1 md:space-x-2 flex items-center">
          {isAuthenticated ? (
            <>
              <Link
                href="/create-post"
                className="hidden sm:inline-block px-2 py-1 md:px-3 md:py-2 rounded-md text-xs md:text-sm font-medium bg-green-500 hover:bg-green-600 transition-colors"
              >
                New Post
              </Link>
              <Link
                href="/users"
                className="hidden sm:inline-block px-2 py-1 md:px-3 md:py-2 rounded-md text-xs md:text-sm font-medium hover:bg-indigo-700"
              >
                Discover
              </Link>
              <Menu as="div" className="relative inline-block text-left">
                <div>
                  <Menu.Button className="flex items-center rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-600 hover:opacity-90">
                    <span className="sr-only">Open user menu</span>
                    <span className="hidden md:inline mr-2 text-sm">
                      {displayName || userEmail?.split('@')[0] || 'User'}
                    </span>
                    <Image
                      className="h-8 w-8 rounded-full bg-gray-200"
                      src={userAvatarForDropdown}
                      alt="User avatar"
                      width={32}
                      height={32}
                    />
                  </Menu.Button>
                </div>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <Menu.Item>
                      {({ active }) => (
                        <Link
                          href="/profile"
                          className={`${
                            active ? 'bg-gray-100' : ''
                          } block px-4 py-2 text-sm text-gray-700 w-full text-left`}
                        >
                          Your Profile
                        </Link>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <Link
                          href="/dashboard"
                          className={`${
                            active ? 'bg-gray-100' : ''
                          } block px-4 py-2 text-sm text-gray-700 w-full text-left`}
                        >
                          Dashboard
                        </Link>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={() =>
                            toast('Settings page coming soon!', { icon: '⚙️' })
                          }
                          className={`${
                            active ? 'bg-gray-100' : ''
                          } block px-4 py-2 text-sm text-gray-700 w-full text-left`}
                        >
                          Settings
                        </button>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={handleLogout}
                          className={`${
                            active ? 'bg-gray-100' : ''
                          } block w-full px-4 py-2 text-left text-sm text-red-600 font-medium`}
                        >
                          Logout
                        </button>
                      )}
                    </Menu.Item>
                  </Menu.Items>
                </Transition>
              </Menu>
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
