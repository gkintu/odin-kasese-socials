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

  it('should show error messages for required fields when submitted empty', async () => {
    const user = userEvent.setup();
    render(<RegistrationForm onSubmit={jest.fn()} />);
    const submitButton = screen.getByRole('button', { name: /register/i });

    await user.click(submitButton); // Click without filling anything

    // findByText is useful for elements that appear asynchronously (like error messages after validation)
    expect(await screen.findByText(/email is required/i)).toBeInTheDocument();
    expect(
      await screen.findByText(/password is required/i)
    ).toBeInTheDocument();
  });

  it('should show an error message for an invalid email format', async () => {
    const user = userEvent.setup();
    render(<RegistrationForm onSubmit={jest.fn()} />);
    const emailInput = screen.getByLabelText(/email/i);
    const submitButton = screen.getByRole('button', { name: /register/i });

    // Type invalid email and submit
    await user.type(emailInput, 'invalidemail');
    await user.click(submitButton);

    // Check for error message
    const errorMessage = await screen.findByText(/invalid email format/i);
    expect(errorMessage).toBeInTheDocument();
  });

  it('should show an error message for a password that is too short', async () => {
    const user = userEvent.setup();
    render(<RegistrationForm onSubmit={jest.fn()} />);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /register/i });

    await user.type(passwordInput, '123'); // Type a short password
    await user.click(submitButton); // Attempt to submit

    expect(
      await screen.findByText(/Password must be at least 8 characters/i)
    ).toBeInTheDocument();
  });

  it('should call the onSubmit prop with form data when the form is valid and submitted', async () => {
    const user = userEvent.setup();
    const mockSubmitHandler = jest.fn();

    render(<RegistrationForm onSubmit={mockSubmitHandler} />);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /register/i });

    // Fill the form with valid data
    await user.type(emailInput, 'valid@example.com');
    await user.type(passwordInput, 'securepassword123');

    // Click the submit button
    await user.click(submitButton);

    // Assertions
    expect(mockSubmitHandler).toHaveBeenCalledTimes(1); // Was it called once?
    expect(mockSubmitHandler).toHaveBeenCalledWith(
      // Was it called with the correct data?
      {
        email: 'valid@example.com',
        password: 'securepassword123',
      },
      expect.anything() // React Hook Form's handleSubmit also passes the event object
    );
  });
});
