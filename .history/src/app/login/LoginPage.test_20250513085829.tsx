// src/app/login/page.test.tsx
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'; // Import waitFor
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

// Add fake timers
jest.useFakeTimers();

// Mock LoginForm (as before)
jest.mock('@/components/Auth/LoginForm', () => {
  // eslint-disable-next-line react/display-name
  return jest.fn(({ onSubmit }) => (
    <form data-testid="mock-login-form" onSubmit={(e) => { 
      e.preventDefault(); 
      // Ensure the onSubmit is called with the correct data structure
      onSubmit({ email: 'user@example.com', password: 'password' }); 
    }}>
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
    // jest.clearAllTimers(); // Optional: clear timers if needed, though useFakeTimers often handles this.

    mockLoginRequest = jest.fn();
    mockLoginSuccess = jest.fn();
    mockLoginFailure = jest.fn();
    mockLoginAsGuest = jest.fn();
    mockPush = jest.fn();

    mockUseRouter.mockReturnValue({ push: mockPush } as any);
    // Default to non-loading, non-error state
    mockUseAuthStore.mockReturnValue({
      loginRequest: mockLoginRequest, 
      loginSuccess: mockLoginSuccess, 
      loginFailure: mockLoginFailure,
      loginAsGuest: mockLoginAsGuest, 
      isLoading: false, 
      error: null,
      isAuthenticated: false, 
      userEmail: null, 
      isGuest: false, 
      logout: jest.fn(), // Add other state fields
    });
  });

  // Test successful login toast
  it('should call toast.success and redirect on successful login', async () => {
    render(<LoginPage />);
    const submitButton = screen.getByRole('button', { name: /mock login/i });

    // Simulate the behavior of loginSuccess more directly within the test
    // by having the handleLogin function call the already mocked loginSuccess

    await userEvent.click(submitButton);

    // Verify loginRequest was called
    expect(mockLoginRequest).toHaveBeenCalled();

    // Advance timers to allow loginUser's setTimeout to complete
    // Wrap in act as it causes state updates (promise resolution)
    act(() => {
      jest.advanceTimersByTime(1500); // Advance by the duration of setTimeout in loginUser
    });

    // Wait for async operations and potential state updates
    await waitFor(() => {
        // The handleLogin in the component should call loginSuccess from the store
        expect(mockLoginSuccess).toHaveBeenCalledWith('user@example.com');
    });
    await waitFor(() => {
       // Check that toast.success was called
       expect(mockToastSuccess).toHaveBeenCalledWith('Login successful for user@example.com!');
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
    // Directly update the mock return value for useAuthStore
    mockUseAuthStore.mockReturnValue({
        loginRequest: mockLoginRequest,
        loginSuccess: mockLoginSuccess,
        loginFailure: mockLoginFailure,
        loginAsGuest: mockLoginAsGuest,
        isLoading: false, 
        error: 'Test Error Message', // Set error message
        isAuthenticated: false, 
        userEmail: null, 
        isGuest: false, 
        logout: jest.fn(),
      });
    
    // Rerender the component with the new state
    rerender(<LoginPage />);

    // Wait for the component to react to the error state and call toast.error
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