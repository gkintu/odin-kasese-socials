// src/components/Auth/RegistrationForm.tsx
import React from 'react';

// We'll define the props type later when we actually use onSubmit
interface RegistrationFormProps {
  onSubmit: (data: any) => void; // Temporary 'any' for data
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({ onSubmit }) => {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit({});
      }}
    >
      <div>
        <label htmlFor="email">Email</label>
        <input type="email" id="email" name="email" />
      </div>
      <div>
        <label htmlFor="password">Passsword</label>
        <input type="password" id="password" name="password" />
      </div>
      <button type="submit">Register</button>
    </form>
  );
};

export default RegistrationForm;
