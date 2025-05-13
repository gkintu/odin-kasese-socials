// src/components/Auth/RegistrationForm.tsx
import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';

// Define the type for our form values
type RegistrationFormValues = {
  email: string;
  password: string;
};

// Update the props interface
interface RegistrationFormProps {
  onSubmit: SubmitHandler<RegistrationFormValues>;
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({ onSubmit }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegistrationFormValues>({
    mode: 'onSubmit', // Validate on submit
    reValidateMode: 'onChange', // Re-validate on change after first submission attempt (good UX)
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          {...register('email', {
            required: 'Email is required',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, // Standard email regex
              message: 'Invalid email format',
            },
          })}
          aria-invalid={errors.email ? 'true' : 'false'} // For accessibility
        />
        {/* Display error message for email field */}
        {errors.email && (
          <span role="alert" style={{ color: 'red', fontSize: '0.875rem' }}>
            {' '}
            {/* Basic styling for now */}
            {errors.email.message}
          </span>
        )}
      </div>

      <div>
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          {...register('password', {
            required: 'Password is required',
            minLength: {
              value: 6,
              message: 'Password must be at least 6 characters',
            },
          })}
          aria-invalid={errors.password ? 'true' : 'false'} // For accessibility
        />
        {/* Display error message for password field */}
        {errors.password && (
          <span role="alert" style={{ color: 'red', fontSize: '0.875rem' }}>
            {' '}
            {/* Basic styling for now */}
            {errors.password.message}
          </span>
        )}
      </div>
      <button type="submit">Register</button>
    </form>
  );
};

export default RegistrationForm;
