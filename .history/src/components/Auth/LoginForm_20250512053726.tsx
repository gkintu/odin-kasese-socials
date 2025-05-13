// src/components/Auth/LoginForm.tsx
import React from 'react';

// Define the props interface for LoginForm
// onSubmit will be called with form data
type LoginFormValues = {
  email: string;
  password: string;
};

// Update the props interface to use the specific type for onSubmit
interface LoginFormProps {
  onSubmit: (data: LoginFormValues) => void; // Use the specific type
}

// Define the LoginForm functional component
const LoginForm: React.FC<LoginFormProps> = ({ onSubmit }) => {
  // Return the form structure
  return (
    // Handle form submission, prevent default browser action, and call the onSubmit prop
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit({});
      }}
    >
      {/* Email field */}
      <div>
        <label htmlFor="email">Email</label>
        <input type="email" id="email" name="email" />
      </div>
      {/* Password field */}
      <div>
        <label htmlFor="password">Password</label>
        <input type="password" id="password" name="password" />
      </div>
      {/* Submit button */}
      <button type="submit">Login</button>
    </form>
  );
};

// Export the component for use in other parts of the application
export default LoginForm;
