import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SignupPage from './page';

// Mock the window.alert function
const mockAlert = jest.fn();
global.alert = mockAlert;

// Mock console.log to prevent noise in test output
const mockConsoleLog = jest.fn();
global.console.log = mockConsoleLog;

describe('SignupPage', () => {
  beforeEach(() => {
    // Clear mock calls between tests
    mockAlert.mockClear();
    mockConsoleLog.mockClear();
  });

  it('renders the signup page with correct heading and subtitle', () => {
    render(<SignupPage />);

    expect(
      screen.getByText(/Create your Kasese Socials account/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/And start connecting with your community!/i)
    ).toBeInTheDocument();
  });

  it('renders the RegistrationForm component', () => {
    render(<SignupPage />);

    // Check for form elements that we know should be present from RegistrationForm
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /register/i })
    ).toBeInTheDocument();
  });

  it('handles form submission correctly', async () => {
    const user = userEvent.setup();
    render(<SignupPage />);

    // Get form elements
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /register/i });

    // Fill in the form
    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');

    // Submit the form
    await user.click(submitButton);

    // Verify console.log was called with the correct data
    expect(mockConsoleLog).toHaveBeenCalledWith(
      'Attempting Kasese Socials Signup with:',
      expect.objectContaining({
        email: 'test@example.com',
        password: 'password123',
      })
    );

    // Verify alert was shown with correct message
    expect(mockAlert).toHaveBeenCalledWith(
      'Registration submitted for test@example.com! (This is a dummy action for now)'
    );
  });

  it('maintains visual styling with proper CSS classes', () => {
    render(<SignupPage />);

    // Check for the main container's styling
    const mainContainer = screen.getByTestId('signup-container');
    expect(mainContainer).toHaveClass(
      'min-h-screen',
      'flex',
      'flex-col',
      'items-center',
      'justify-center',
      'bg-gray-50'
    );

    // Check for the form container's styling
    const formContainer = screen.getByTestId('form-container');
    expect(formContainer).toHaveClass(
      'max-w-md',
      'w-full',
      'space-y-8',
      'p-10',
      'bg-white',
      'shadow-xl',
      'rounded-xl'
    );
  });
});
