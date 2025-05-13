// src/components/Auth/LoginForm.tsx
import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';

// Define a specific type for the form values
type LoginFormValues = {
  email: string;
  password: string;
};

// Update the props interface to use SubmitHandler from react-hook-form
interface LoginFormProps {
  onSubmit: SubmitHandler<LoginFormValues>; // SubmitHandler is a RHF type for the submit function
}

// Define the LoginForm functional component
const LoginForm: React.FC<LoginFormProps> = ({ onSubmit }) => {
  // Destructure errors from formState
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    mode: 'onSubmit', // Validate on submit
    reValidateMode: 'onChange', // Validate on change after the first submission attempt
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 w-full">
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700"
        >
          Email address
        </label>
        <input
          type="email"
          id="email"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          // Register email input with validation rules
          {...register('email', {
            required: 'Email is required', // Rule: email is required
            pattern: {
              // Rule: email should match a basic email pattern
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Invalid email format',
            },
          })}
          // Accessibility: mark input as invalid if there's an error
          aria-invalid={errors.email ? 'true' : 'false'}
        />
        {/* Display error message for email field if it exists */}
        {errors.email && (
          <p className="mt-2 text-sm text-red-600" role="alert">
            {errors.email.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700"
        >
          Password
        </label>
        <input
          type="password"
          id="password"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          // Register password input with validation rules
          {...register('password', {
            required: 'Password is required', // Rule: password is required
          })}
          // Accessibility: mark input as invalid if there's an error
          aria-invalid={errors.password ? 'true' : 'false'}
        />
        {/* Display error message for password field if it exists */}
        {errors.password && (
          <p className="mt-2 text-sm text-red-600" role="alert">
            {errors.password.message}
          </p>
        )}
      </div>

      <div>
        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Login
        </button>
      </div>
    </form>
  );
};

// Export the component for use in other parts of the application
export default LoginForm;
