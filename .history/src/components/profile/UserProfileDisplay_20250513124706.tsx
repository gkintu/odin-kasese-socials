// src/components/profile/UserProfileDisplay.tsx
import React from 'react';
import Image from 'next/image'; // Using Next.js Image component for optimization
import Link from 'next/link';

// Define props for the component
interface UserProfileDisplayProps {
  displayName?: string; // Display name is optional
  userEmail: string; // Email is required (e.g. for fallback or other info)
  bio: string;
  avatarUrl: string; // URL for the profile picture
  isCurrentUser?: boolean; // Add a prop to indicate if this is the current user's profile to show edit button
}

const UserProfileDisplay: React.FC<UserProfileDisplayProps> = ({
  displayName,
  userEmail,
  bio,
  avatarUrl, // This prop is of type string
  isCurrentUser, // Use isCurrentUser
}) => {
  // Determine the name to display: displayName or fallback to userEmail
  const nameToDisplay = displayName || userEmail;

  // Ensure a valid src is always passed to the Image component.
  // If avatarUrl is an empty string or otherwise falsey, fall back to the default avatar.
  const imageSrc = avatarUrl ? avatarUrl : '/img/default-avatar.png';

  return (
    // Main container for the profile display
    <div className="bg-white shadow-xl rounded-lg p-6 md:p-8">
      {/* Profile Header section */}
      <div className="flex flex-col items-center md:flex-row md:items-start">
        {/* Profile Picture */}
        <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-indigo-500 shadow-lg mb-4 md:mb-0 md:mr-8">
          <Image
            src={imageSrc} // Use the validated/defaulted imageSrc
            alt="Profile picture" // Alt text for accessibility
            width={160} // Provide width and height for Next/Image
            height={160}
            className="object-cover w-full h-full" // Ensure image covers the area
            priority // Consider making avatar priority if it's LCP
          />
        </div>

        {/* Profile Information */}
        <div className="text-center md:text-left flex-grow">
          {/* Display Name */}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
            {nameToDisplay}
          </h1>
          {/* User Email (shown below display name if different or as primary if no display name) */}
          {displayName && (
            <p className="text-md text-gray-500 mt-1">{userEmail}</p>
          )}
          {/* Bio */}
          <p className="text-gray-600 mt-3 text-sm md:text-base">{bio}</p>
          {/* Edit Profile Button - shown only if isCurrentUser is true */}
          {isCurrentUser && (
            <Link href="/profile/edit" legacyBehavior>
              <a className="mt-4 inline-block px-6 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Edit Profile
              </a>
            </Link>
          )}
        </div>
      </div>

      {/* Divider */}
      <hr className="my-6 md:my-8 border-t border-gray-300" />

      {/* Posts Section */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          Your Posts
        </h2>
        {/* Placeholder for where user's posts will be listed */}
        <div className="text-center text-gray-500 p-4 border-2 border-dashed border-gray-300 rounded-md">
          <p>Your amazing posts will appear here soon!</p>
          <p>(Dummy post list placeholder)</p>
        </div>
      </div>
    </div>
  );
};

export default UserProfileDisplay;
