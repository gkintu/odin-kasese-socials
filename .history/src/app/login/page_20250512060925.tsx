// src/app/login/page.tsx
'use client'; // Needed because we handle form submission state/logic here,
// and LoginForm is interactive.

import React from 'react';
import LoginForm from '@/components/Auth/LoginForm'; // Adjust path if necessary
import { SubmitHandler } from 'react-hook-form'; // For typing form data

// Define the type for login form values (can be shared or re-defined)
type LoginFormValues = {
  email: string;
  password: string;
};

// Define the LoginPage functional component
const LoginPage: React.FC = () => {
  // Define the handler for login form submission
  const handleLogin: SubmitHandler<LoginFormValues> = (data) => {
    // Log attempt to console
    console.log('Attempting Kasese Socials Login with:', data);
    // For Phase 1, this is a dummy action. In a real app, this would call an API.
    alert(`Login attempt for ${data.email}! (This is a dummy action for now)`);
    // Future: Redirect user or update auth state.
  };

  return (
    // Main container with Tailwind styling for centering content
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      {/* Inner container for the form, with styling */}
      <div className="max-w-md w-full space-y-8 p-10 bg-white shadow-xl rounded-xl">
        <div>
          {/* Page title */}
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to Kasese Socials
          </h2>
          {/* Sub-text */}
          <p className="mt-2 text-center text-sm text-gray-600">
            Welcome back!
          </p>
        </div>
        {/* Render the LoginForm component, passing the handleLogin handler */}
        <LoginForm onSubmit={handleLogin} />
      </div>
    </div>
  );
};

export default LoginPage;
