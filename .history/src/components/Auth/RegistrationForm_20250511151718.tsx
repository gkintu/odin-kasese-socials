// src/components/Auth/RegistrationForm.tsx
import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form'; // Import useForm and SubmitHandler

// Define the type for our form values
type RegistrationFormValues = {
  email: string;
  password: string;
};

// Update the props interface
interface RegistrationFormProps {
  onSubmit: SubmitHandler<RegistrationFormValues>; // SubmitHandler is a RHF type
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({ onSubmit }) => {
  const { register, handleSubmit } = useForm<RegistrationFormValues>();

  // The actual submission logic will be handled by the onSubmit prop
  // passed to handleSubmit.

  return (
    // handleSubmit will validate inputs before calling our onSubmit prop
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          {...register('email')} // Register the email input
        />
      </div>
      <div>
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          {...register('password')} // Register the password input
        />
      </div>
      <button type="submit">Register</button>
    </form>
  );
};

export default RegistrationForm;
