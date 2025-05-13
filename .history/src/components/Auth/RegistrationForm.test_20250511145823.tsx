import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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

  it('should allow users to enter email and password', async () => {
    const user = userEvent.setup(); // Set up userEvent
    render(<RegistrationForm onSubmit={jest.fn()} />);
    const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement; // Cast for .value
    const passwordInput = screen.getByLabelText(
      /password/i
    ) as HTMLInputElement; // Cast for .value

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');

    expect(emailInput.value).toBe('test@example.com');
    expect(passwordInput.value).toBe('password123');
  });
});
