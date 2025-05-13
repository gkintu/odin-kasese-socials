'use client';

import React from 'react';
import RegistrationForm from '@/components/Auth/RegistrationForm';
import { SubmitHandler } from 'react-hook-form';

type RegistrationFormValues = {
  email: string;
  password: string;
};

const SignupPage: React.FC = () => {
  const handleRegistration: SubmitHandler<RegistrationFormValues> = (data) => {
    console.log('Attempting Kasese Socials Signup with:', data);
    // In a real application, this is where you would make an API call
    // to your backend to actually register the user.
    // For Phase 1, we're using dummy data and mocked submissions.
    alert(
      `Registration submitted for ${data.email}! (This is a dummy action for now)`
    );
    // You might want to redirect the user or clear the form here in a real app.
  };

  return (
    <div
      data-testid="signup-container"
      className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8"
    >
      <div
        data-testid="form-container"
        className="max-w-md w-full space-y-8 p-10 bg-white shadow-xl rounded-xl"
      >
        <div>
          {/* You could add a logo here later */}
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your Kasese Socials account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            And start connecting with your community!
          </p>
        </div>
        <RegistrationForm onSubmit={handleRegistration} />
      </div>
    </div>
  );
};

export default SignupPage;
