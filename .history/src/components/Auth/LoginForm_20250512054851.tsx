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
  // Destructure register and handleSubmit from useForm, typed with LoginFormValues
  const { register, handleSubmit } = useForm<LoginFormValues>();

  // Use RHF's handleSubmit to the form's onSubmit, which wraps our onSubmit prop
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Email field */}
      <div>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          // Register the email input with react-hook-form
          {...register('email')}
        />
      </div>
      {/* Password field */}
      <div>
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          // Register the password input with react-hook-form
          {...register('password')}
        />
      </div>
      {/* Submit button */}
      <button type="submit">Login</button>
    </form>
  );
};

// Export the component for use in other parts of the application
export default LoginForm;
