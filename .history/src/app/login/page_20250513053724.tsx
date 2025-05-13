// src/app/login/page.tsx
'use client'; // Needed because we handle form submission state/logic here,
// and LoginForm is interactive.

import React from 'react';
import LoginForm from '@/components/Auth/LoginForm';
import { SubmitHandler } from 'react-hook-form';
import { useAuthStore } from '@/lib/store/authStore';
import { useRouter } from 'next/navigation';

// Define the type for login form values (can be shared or re-defined)
type LoginFormValues = {
  email: string;
  password: string;
};

// Define the LoginPage functional component
const LoginPage: React.FC = () => {
  const {
    loginRequest,
    loginSuccess,
    loginFailure,
    loginAsGuest,
    isLoading,
    error,
  } = useAuthStore(); // Get actions from the auth store
  const router = useRouter(); // Get router instance

  const handleLogin: SubmitHandler<LoginFormValues> = async (data) => {
    loginRequest(); // Dispatch loginRequest action to set isLoading to true

    // Simulate an API call
    console.log('Attempting Kasese Socials Login with:', data);
    await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate network delay

    // Dummy validation: In a real app, this comes from the backend response
    if (data.email === 'user@example.com' && data.password === 'password') {
      loginSuccess(data.email); // Dispatch loginSuccess with email
      alert(`Login successful for ${data.email}!`); // Show success alert
      router.push('/dashboard'); // Redirect to dashboard
    } else {
      loginFailure('Invalid email or password.'); // Dispatch loginFailure with error message
      // The error message will be displayed below
    }
  };

  const handleGuestLogin = () => {
    loginAsGuest(); // Dispatch loginAsGuest action
    alert('Browse as Guest.'); // Show guest alert
    router.push('/'); // Redirect to homepage
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
        {/* Guest login button */}
        <div className="mt-6">
          <button
            onClick={handleGuestLogin}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Continue as Guest
          </button>
        </div>
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
