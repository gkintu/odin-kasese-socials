// src/components/profile/UserProfileDisplay.tsx
import React from 'react';
import Image from 'next/image'; // Using Next.js Image component for optimization

// Define props for the component
interface UserProfileDisplayProps {
  displayName?: string; // Display name is optional
  userEmail: string; // Email is required (e.g. for fallback or other info)
  bio: string;
  avatarUrl: string; // URL for the profile picture
}

const UserProfileDisplay: React.FC<UserProfileDisplayProps> = ({
  displayName,
  userEmail,
  bio,
  avatarUrl, // This prop is of type string
}) => {
  // Determine the name to display: displayName or fallback to userEmail
  const nameToDisplay = displayName || userEmail;

  // Ensure a valid src is always passed to the Image component.
  // If avatarUrl is an empty string, fall back to the default avatar.
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
        <div className="text-center md:text-left">
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
          {/* Placeholder for "Edit Profile" button - Future Feature */}
          {/* <button className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">Edit Profile</button> */}
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
