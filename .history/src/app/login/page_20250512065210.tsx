// src/app/login/page.tsx
'use client'; // Needed because we handle form submission state/logic here,
// and LoginForm is interactive.

import React from 'react';
import LoginForm from '@/components/Auth/LoginForm'; // Adjust path if necessary
import { SubmitHandler } from 'react-hook-form'; // For typing form data
import { useAuthStore } from '@/lib/store/authStore'; // Import the auth store hook
import { useRouter } from 'next/navigation'; // Import useRouter

// Define the type for login form values (can be shared or re-defined)
type LoginFormValues = {
  email: string;
  password: string;
};

// Define the LoginPage functional component
const LoginPage: React.FC = () => {
  const { loginRequest, loginSuccess, loginFailure, isLoading, error } =
    useAuthStore(); // Get actions from the auth store
  const router = useRouter(); // Get router instance

  const handleLogin: SubmitHandler<LoginFormValues> = async (data) => {
    loginRequest(); // Dispatch loginRequest action to set isLoading to true

    // Simulate an API call
    console.log('Attempting Kasese Socials Login with:', data);
    await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate network delay

    // Dummy validation: In a real app, this comes from the backend response
    if (data.email === 'user@example.com' && data.password === 'password') {
      loginSuccess(data.email); // Dispatch loginSuccess with email
      router.push('/'); // Redirect to homepage
    } else {
      loginFailure('Invalid email or password.'); // Dispatch loginFailure with error message
      // The error message will be displayed below
    }
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
            Welcome back! (Hint: user@example.com password)
          </p>
        </div>
        {/* Render the LoginForm component, passing the handleLogin handler */}
        <LoginForm onSubmit={handleLogin} />
        {/* Display loading state */}
        {isLoading && (
          <p className="mt-4 text-center text-sm text-blue-600">
            Logging in...
          </p>
        )}
        {/* Display error message from the store */}
        {error && !isLoading && (
          <p className="mt-4 text-center text-sm text-red-600" role="alert">
            Login failed: {error}
          </p>
        )}
        {/* Optionally, show a success message here too if not redirecting immediately */}
      </div>
    </div>
  );
};

export default LoginPage;
