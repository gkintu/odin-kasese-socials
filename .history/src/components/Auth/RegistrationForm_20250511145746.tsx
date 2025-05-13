// src/components/Auth/RegistrationForm.tsx
import React from 'react';

// Define the type for our form values
type RegistrationFormValues = {
  email: string;
  password: string;
};

// Update the props interface
interface RegistrationFormProps {
  onSubmit: (data: RegistrationFormValues) => void; // Use the specific type
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({ onSubmit }) => {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit({ email: '', password: '' });
      }}
    >
      <div>
        <label htmlFor="email">Email</label>
        <input type="email" id="email" name="email" />
      </div>
      <div>
        <label htmlFor="password">Password</label>
        <input type="password" id="password" name="password" />
      </div>
      <button type="submit">Register</button>
    </form>
  );
};

export default RegistrationForm;
