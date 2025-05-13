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
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
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
          // Role="alert" for accessibility
          <span role="alert" style={{ color: 'red', fontSize: '0.875rem' }}>
            {errors.email.message}
          </span>
        )}
      </div>

      <div>
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          // Register password input with validation rules
          {...register('password', {
            required: 'Password is required', // Rule: password is required
          })}
          // Accessibility: mark input as invalid if there's an error
          aria-invalid={errors.password ? 'true' : 'false'}
        />
        {/* Display error message for password field if it exists */}
        {errors.password && (
          // Role="alert" for accessibility
          <span role="alert" style={{ color: 'red', fontSize: '0.875rem' }}>
            {errors.password.message}
          </span>
        )}
      </div>
      <button type="submit">Login</button>
    </form>
  );
};

// Export the component for use in other parts of the application
export default LoginForm;
