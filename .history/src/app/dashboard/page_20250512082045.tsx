import React from 'react';
import ProtectedRoute from '@/components/Auth/ProtectedRoute'; // Import ProtectedRoute

const DashboardPageContent: React.FC = () => {
  // This is the actual content of the dashboard, rendered only if authenticated
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">User Dashboard</h1>
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

// The Page component that wraps the content with ProtectedRoute
const DashboardPage: React.FC = () => {
  return (
    <ProtectedRoute>
      <DashboardPageContent />
    </ProtectedRoute>
  );
};

export default DashboardPage;
