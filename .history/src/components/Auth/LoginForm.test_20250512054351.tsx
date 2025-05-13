import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginForm from './LoginForm'; // This will initially cause an error

// Describe block for grouping tests related to the LoginForm
describe('LoginForm', () => {
  // Test case to ensure essential UI elements are rendered
  it('should render email input, password input, and login button', () => {
    // Render the LoginForm component with a mock onSubmit function
    render(<LoginForm onSubmit={jest.fn()} />);

    // Assert that an input field associated with a label "Email" (case-insensitive) is in the document
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    // Assert that an input field associated with a label "Password" (case-insensitive) is in the document
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    // Assert that a button with the accessible name "Login" (case-insensitive) is in the document
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  // Test case to ensure users can enter email and password
  it('should allow users to enter email and password', async () => {
    const user = userEvent.setup(); // Set up userEvent for simulating user interactions
    // Render the LoginForm with a mock onSubmit function
    render(<LoginForm onSubmit={jest.fn()} />);

    // Get the email input field and cast it to HTMLInputElement to access its .value property
    const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement;
    // Get the password input field and cast it
    const passwordInput = screen.getByLabelText(
      /password/i
    ) as HTMLInputElement;

    // Simulate user typing into the email field
    await user.type(emailInput, 'testuser@example.com');
    // Simulate user typing into the password field
    await user.type(passwordInput, 'password123');

    // Assert that the email input's value matches what was typed
    expect(emailInput.value).toBe('testuser@example.com');
    // Assert that the password input's value matches what was typed
    expect(passwordInput.value).toBe('password123');
  });
});
