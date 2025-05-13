// src/app/signup/page.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SignupPage from './page'; // Imports src/app/signup/page.tsx

// Mock the RegistrationForm component
// This allows us to test the SignupPage in isolation without re-testing RegistrationForm's internals.
jest.mock('@/components/Auth/RegistrationForm', () => {
  // The mock component should replicate the props interface of the original, especially onSubmit
  return jest.fn(({ onSubmit }) => (
    <form
      data-testid="mock-registration-form"
      onSubmit={(e) => {
        e.preventDefault();
        // Simulate a submission with some dummy data for testing the page's handler
        onSubmit({ email: 'test@example.com', password: 'password' });
      }}
    >
      <label htmlFor="mock-email">Email</label>
      <input id="mock-email" type="email" />
      <button type="submit">Mock Register</button>
    </form>
  ));
});

// Mock window.alert as it's called in handleRegistration
global.alert = jest.fn();

describe('SignupPage', () => {
  beforeEach(() => {
    // Clear mock history before each test
    (global.alert as jest.Mock).mockClear();
    // Also clear the mock component's call history if needed, though RegistrationForm is re-mocked per import
    // require('@/components/Auth/RegistrationForm').mockClear(); // This syntax might be needed if mock isn't clearing
  });

  it('should render the signup page title and the registration form', () => {
    render(<SignupPage />);

    expect(
      screen.getByText(/Create your Kasese Socials account/i)
    ).toBeInTheDocument();
    expect(screen.getByTestId('mock-registration-form')).toBeInTheDocument();
  });

  it('should call the handleRegistration function when the mock form is submitted', async () => {
    const user = userEvent.setup();
    const consoleSpy = jest.spyOn(console, 'log'); // Spy on console.log

    render(<SignupPage />);

    const submitButton = screen.getByRole('button', { name: /mock register/i });
    await user.click(submitButton);

    // Check if the page's handleRegistration logic was triggered
    expect(consoleSpy).toHaveBeenCalledWith(
      'Attempting Kasese Socials Signup with:',
      { email: 'test@example.com', password: 'password' }
    );
    expect(global.alert).toHaveBeenCalledWith(
      'Registration submitted for test@example.com! (This is a dummy action for now)'
    );

    consoleSpy.mockRestore(); // Clean up the spy
  });
});
