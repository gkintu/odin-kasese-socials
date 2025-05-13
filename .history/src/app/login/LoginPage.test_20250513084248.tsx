// src/app/login/page.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react'; // Import waitFor
import userEvent from '@testing-library/user-event';
import LoginPage from './page';
import { useAuthStore } from '@/lib/store/authStore';
import { useRouter } from 'next/navigation';
// Import toast for mocking
import toast from 'react-hot-toast';

// Mock dependencies
jest.mock('@/lib/store/authStore');
jest.mock('next/navigation', () => ({ useRouter: jest.fn() }));
// Mock react-hot-toast
jest.mock('react-hot-toast', () => ({
  success: jest.fn(), // Mock success function
  error: jest.fn(),   // Mock error function
  // Toaster component doesn't need a complex mock unless testing its props
  Toaster: () => <div data-testid="mock-toaster"></div>,
}));
// Mock LoginForm (as before)
jest.mock('@/components/Auth/LoginForm', () => {
  // eslint-disable-next-line react/display-name
  return jest.fn(({ onSubmit }) => (
    <form data-testid="mock-login-form" onSubmit={(e) => { e.preventDefault(); onSubmit({ email: 'user@example.com', password: 'password' }); }}>
      <button type="submit">Mock Login</button>
    </form>
  ));
});


describe('LoginPage', () => {
  const mockUseAuthStore = useAuthStore as jest.MockedFunction<typeof useAuthStore>;
  const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;
  let mockLoginRequest: jest.Mock, mockLoginSuccess: jest.Mock, mockLoginFailure: jest.Mock, mockLoginAsGuest: jest.Mock;
  let mockPush: jest.Mock;
  // Get mock toast functions
  const mockToastSuccess = toast.success as jest.Mock;
  const mockToastError = toast.error as jest.Mock;


  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();

    mockLoginRequest = jest.fn();
    mockLoginSuccess = jest.fn();
    mockLoginFailure = jest.fn();
    mockLoginAsGuest = jest.fn();
    mockPush = jest.fn();

    mockUseRouter.mockReturnValue({ push: mockPush } as any);
    // Default to non-loading, non-error state
    mockUseAuthStore.mockReturnValue({
      loginRequest: mockLoginRequest, loginSuccess: mockLoginSuccess, loginFailure: mockLoginFailure,
      loginAsGuest: mockLoginAsGuest, isLoading: false, error: null,
      isAuthenticated: false, userEmail: null, isGuest: false, logout: jest.fn(), // Add other state fields
    });
  });

  // Test successful login toast
  it('should call toast.success and redirect on successful login', async () => {
    render(<LoginPage />);
    const submitButton = screen.getByRole('button', { name: /mock login/i });

    // Simulate successful login by having handleLogin call loginSuccess
    // We need to adjust the mock implementation to reflect this for the test
    mockLoginSuccess.mockImplementation(() => {
        // Simulate the state update that happens in the store
        mockUseAuthStore.mockReturnValue({
             ...useAuthStore(), // Keep other actions
             isAuthenticated: true, userEmail: 'user@example.com', isLoading: false, error: null,
             loginSuccess: mockLoginSuccess, // Ensure the mock fn persists if needed
        });
    });

    await userEvent.click(submitButton);

    // Verify loginRequest and loginSuccess were called
    expect(mockLoginRequest).toHaveBeenCalled();
    // We assume loginSuccess is called inside handleLogin after the promise
    // Need to wait for async operations and potential state updates
    await waitFor(() => {
        expect(mockLoginSuccess).toHaveBeenCalledWith('user@example.com');
    });
    await waitFor(() => {
       // Check that toast.success was called (content matching might be brittle)
       expect(mockToastSuccess).toHaveBeenCalledWith(expect.stringContaining('Login successful!'));
    });
    await waitFor(() => {
       // Check for redirection
       expect(mockPush).toHaveBeenCalledWith('/dashboard');
    });
  });

  // Test error toast using useEffect
  it('should call toast.error when error state changes', async () => {
    // Initial render with no error
     const { rerender } = render(<LoginPage />);
     expect(mockToastError).not.toHaveBeenCalled();

    // Simulate error state update from the store
    act(() => {
      mockUseAuthStore.mockReturnValue({
        ...useAuthStore(), // Keep existing mocks/state
        isLoading: false, // Ensure not loading
        error: 'Test Error Message', // Set error message
      });
      // Re-render might be needed if the hook dependency causes update,
      // or direct state simulation if useEffect trigger is reliable
       rerender(<LoginPage />); // Rerender with new mocked state
    });


    // Wait for the useEffect hook to potentially run and trigger the toast
    await waitFor(() => {
       expect(mockToastError).toHaveBeenCalledWith('Login failed: Test Error Message');
    });
  });

  // Test guest login toast
  it('should call toast.success and redirect on guest login', async () => {
    render(<LoginPage />);
    const guestButton = screen.getByRole('button', { name: /continue as guest/i });

    await userEvent.click(guestButton);

    // Check store action called
    expect(mockLoginAsGuest).toHaveBeenCalled();
    // Check toast called
    expect(mockToastSuccess).toHaveBeenCalledWith('Browse as Guest.');
    // Check redirection called
    expect(mockPush).toHaveBeenCalledWith('/');
  });

});