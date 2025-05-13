// src/app/login/page.test.tsx
import {
  render,
  screen,
  waitFor
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginPage from './page';
import { useAuthStore } from '@/lib/store/authStore';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

// Mock dependencies
jest.mock('@/lib/store/authStore');
jest.mock('next/navigation', () => ({ useRouter: jest.fn() }));
jest.mock('react-hot-toast', () => ({
  success: jest.fn(),
  error: jest.fn(),
  Toaster: () => <div data-testid="mock-toaster" />,
}));

// Mock the LoginForm component
jest.mock('@/components/Auth/LoginForm', () => {
  return jest.fn(({ onSubmit }) => (
    <form
      data-testid="mock-login-form"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit({ email: 'user@example.com', password: 'password' });
      }}
    >
      <button type="submit">Mock Login</button>
    </form>
  ));
});

describe('LoginPage', () => {
  const mockUseAuthStore = useAuthStore as jest.MockedFunction<typeof useAuthStore>;
  const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;
  let mockLoginRequest: jest.Mock;
  let mockLoginSuccess: jest.Mock;
  let mockLoginFailure: jest.Mock;
  let mockLoginAsGuest: jest.Mock;
  let mockPush: jest.Mock;

  const mockToastSuccess = toast.success as jest.Mock;
  const mockToastError = toast.error as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    mockLoginRequest = jest.fn();
    mockLoginSuccess = jest.fn();
    mockLoginFailure = jest.fn();
    mockLoginAsGuest = jest.fn();
    mockPush = jest.fn();

    // Mock router with typed return value
    mockUseRouter.mockReturnValue({
      push: mockPush,
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
    });

    // Mock auth store state
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
      logout: jest.fn(),
    });
  });

  it('should call toast.success and redirect on successful login', async () => {
    render(<LoginPage />);
    const submitButton = screen.getByRole('button', { name: /mock login/i });

    await userEvent.click(submitButton);

    expect(mockLoginRequest).toHaveBeenCalled();

    await waitFor(() => {
      expect(mockLoginSuccess).toHaveBeenCalledWith('user@example.com');
    });
    await waitFor(() => {
      expect(mockToastSuccess).toHaveBeenCalledWith(
        'Login successful for user@example.com!'
      );
    });
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('should call toast.error when error state changes', async () => {
    const { rerender } = render(<LoginPage />);
    expect(mockToastError).not.toHaveBeenCalled();

    mockUseAuthStore.mockReturnValue({
      loginRequest: mockLoginRequest,
      loginSuccess: mockLoginSuccess,
      loginFailure: mockLoginFailure,
      loginAsGuest: mockLoginAsGuest,
      isLoading: false,
      error: 'Test Error Message',
      isAuthenticated: false,
      userEmail: null,
      isGuest: false,
      logout: jest.fn(),
    });

    rerender(<LoginPage />);

    await waitFor(() => {
      expect(mockToastError).toHaveBeenCalledWith(
        'Login failed: Test Error Message'
      );
    });
  });

  it('should call toast.success and redirect on guest login', async () => {
    render(<LoginPage />);
    const guestButton = screen.getByRole('button', { name: /continue as guest/i });

    await userEvent.click(guestButton);

    expect(mockLoginAsGuest).toHaveBeenCalled();
    expect(mockToastSuccess).toHaveBeenCalledWith('Browse as Guest.');
    expect(mockPush).toHaveBeenCalledWith('/');
  });
});