// src/components/users/UserList.tsx
import React from 'react';
import { ListedUser } from '@/types/user'; // User type
import UserListItem from '../users /UserListItem'; // Actual UserListItem component

// Define props for UserList
interface UserListProps {
  users: ListedUser[]; // Array of users
  onToggleFollow: (userId: string) => void; // Callback for follow/unfollow actions
}

const UserList: React.FC<UserListProps> = ({ users, onToggleFollow }) => {
  // Handle empty state
  if (!users || users.length === 0) {
    return (
      <div className="text-center text-gray-500 py-10">
        <p>No users found at this time. Be the first to invite your friends!</p>
      </div>
    );
  }

  // Render list of users
  return (
    <div className="space-y-3 sm:space-y-4"> {/* Spacing between UserListItems */}
      {users.map((user) => (
        <UserListItem
          key={user.id} // Use user.id as key
          user={user}
          onToggleFollow={onToggleFollow} // Pass down the handler
        />
      ))}
    </div>
  );
};

export default UserList;