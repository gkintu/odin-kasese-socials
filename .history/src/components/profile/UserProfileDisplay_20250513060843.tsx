import React from 'react';

interface UserProfileDisplayProps {
  userEmail: string;
  bio: string;
  avatarUrl: string;
}

const UserProfileDisplay: React.FC<UserProfileDisplayProps> = ({ userEmail, bio, avatarUrl }) => {
  return (
    <div className="text-center p-6 bg-white shadow-md rounded-lg">
      <img
        src={avatarUrl}
        alt="User Avatar"
        className="w-24 h-24 rounded-full mx-auto mb-4"
      />
      <h2 className="text-2xl font-semibold mb-2">{userEmail}</h2>
      <p className="text-gray-600">{bio}</p>
    </div>
  );
};

export default UserProfileDisplay;
