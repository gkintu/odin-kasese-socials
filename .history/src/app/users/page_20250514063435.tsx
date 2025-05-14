// src/app/users/page.tsx
'use client'; // This page uses client-side state (useState) and event handlers

import React, { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/Auth/ProtectedRoute';
import UserList from '@/components/users/UserList'; // Our UserList component
import { ListedUser } from '@/types/user';      // User type
import { useAuthStore } from '@/lib/store/authStore'; // To check guest status
import toast from 'react-hot-toast';

// Function to generate dummy users
const generateDummyListedUsers = (count: number): ListedUser[] => {
  const users: ListedUser[] = [];
  const names = ['Alice Smith', 'Bob Johnson', 'Charlie Davis', 'Diana Garcia', 'Edward Wilson', 'Fiona Brown'];
  for (let i = 1; i <= count; i++) {
    users.push({
      id: `user${i}`,
      displayName: names[i % names.length] + (i > names.length ? ` ${Math.floor(i/names.length)}` : ''),
      avatarUrl: `/img/avatars/generic${(i % 3) + 1}.png`, // e.g., generic1.png, generic2.png, generic3.png
      isFollowing: Math.random() < 0.3, // ~30% chance of initially following
    });
  }
  return users;
};
// Ensure you have public/img/avatars/generic1.png, generic2.png, generic3.png

const UsersPage: React.FC = () => {
  // Get guest status from auth store
  const { isGuest, isLoading: authIsLoading } = useAuthStore();
  // State for the list of users, initialized with dummy data
  const [users, setUsers] = useState<ListedUser[]>([]);

  // useEffect to load dummy users once on component mount
  useEffect(() => {
    setUsers(generateDummyListedUsers(10)); // Generate 10 dummy users
  }, []);


  // Handler to toggle the follow status of a user
  const handleToggleFollow = (userId: string) => {
    setUsers((currentUsers) =>
      currentUsers.map((user) =>
        user.id === userId ? { ...user, isFollowing: !user.isFollowing } : user
      )
    );
    // Find the user to show their name in the toast
    const toggledUser = users.find(u => u.id === userId);
    if (toggledUser) {
        toast.success(
            toggledUser.isFollowing ? `Unfollowed ${toggledUser.displayName} (dummy)` : `Followed ${toggledUser.displayName} (dummy)`
        );
    }
  };

  // Page Content Logic
  const PageContent: React.FC = () => {
    if (authIsLoading) {
      return <p className="text-center text-gray-600 mt-10">Loading users...</p>;
    }

    // Guests can view the user list for discovery
    // No specific restriction for guests here, ProtectedRoute already allows them if configured

    return (
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 sm:mb-8 text-center">
          Discover Users
        </h1>
        <UserList users={users} onToggleFollow={handleToggleFollow} />
      </div>
    );
  };


  return (
    // Wrap with ProtectedRoute. Guests are allowed by current ProtectedRoute logic.
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8 min-h-screen bg-gray-50">
        <PageContent />
      </div>
    </ProtectedRoute>
  );
};

export default UsersPage;