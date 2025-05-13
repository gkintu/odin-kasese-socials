import React from 'react';

const DashboardPage: React.FC = () => {
  return (
    <div className="container mx-auto p-8">
      {/* Page title */}
      <h1 className="text-3xl font-bold text-gray-800 mb-6">User Dashboard</h1>
      {/* Placeholder content */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <p className="text-gray-700">
          Welcome to your Kasese Socials dashboard! This area is protected.
        </p>
        <p className="mt-4 text-gray-600">
          (More features will be added here soon.)
        </p>
      </div>
    </div>
  );
};

export default DashboardPage;
