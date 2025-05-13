import { render, screen } from '@testing-library/react';
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
});
