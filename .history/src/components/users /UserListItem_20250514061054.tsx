// src/components/users/UserListItem.tsx
import React from 'react';
import Image from 'next/image';
import { ListedUser } from '@/types/user'; // Import the user type

// Define props for the component
interface UserListItemProps {
  user: ListedUser; // The user data to display
  onToggleFollow: (userId: string) => void; // Callback when follow/unfollow button is clicked
}

const UserListItem: React.FC<UserListItemProps> = ({ user, onToggleFollow }) => {
  const { id, displayName, avatarUrl, isFollowing } = user;

  // Handler for the follow/unfollow button click
  const handleFollowClick = () => {
    onToggleFollow(id); // Call the callback with the user's ID
  };

  return (
    // Main container for list item with Tailwind styling
    <div className="flex items-center justify-between p-3 sm:p-4 bg-white shadow rounded-lg my-2 hover:shadow-md transition-shadow">
      {/* User Info Section */}
      <div className="flex items-center">
        {/* User Avatar */}
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden mr-3 sm:mr-4 border border-gray-200">
          <Image
            src={avatarUrl}
            alt={`${displayName}'s avatar`}
            width={48} // Base size for Next/Image
            height={48}
            className="object-cover w-full h-full"
          />
        </div>
        {/* User Display Name */}
        <span className="font-medium text-gray-800 text-sm sm:text-base">{displayName}</span>
      </div>

      {/* Follow/Unfollow Button */}
      <button
        onClick={handleFollowClick}
        aria-label={isFollowing ? `Unfollow ${displayName}` : `Follow ${displayName}`}
        className={`px-3 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors
          ${
            isFollowing
              ? 'bg-gray-200 text-gray-700 hover:bg-gray-300 focus:ring-gray-400' // Unfollow state
              : 'bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500' // Follow state
          }`}
      >
        {isFollowing ? 'Unfollow' : 'Follow'}
      </button>
    </div>
  );
};

export default UserListItem;