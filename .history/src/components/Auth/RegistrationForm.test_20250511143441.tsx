// src/components/Auth/RegistrationForm.test.tsx
import { render, screen } from '@testing-library/react';
import RegistrationForm from './RegistrationForm'; // This will initially cause an error or warning

describe('RegistrationForm', () => {
  it('should render email input, password input, and submit button', () => {
    render(<RegistrationForm onSubmit={jest.fn()} />); // Pass a mock onSubmit for now

    // Using getByLabelText is preferred for accessibility and robustness
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();

    // For buttons, getByRole is a good choice
    expect(
      screen.getByRole('button', { name: /register/i })
    ).toBeInTheDocument();
  });
});
