// src/app/profile/edit/page.test.tsx
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import EditProfilePage from './page';
import { useAuthStore } from '@/lib/store/authStore';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

// Mock dependencies
jest.mock('@/lib/store/authStore');
jest.mock('next/navigation', () => ({ useRouter: jest.fn() }));
jest.mock('@/components/profile/EditProfileForm', () => {
  // eslint-disable-next-line react/display-name
  return jest.fn(
    ({ onSubmit }: { onSubmit: (data: { displayName: string }) => void }) => (
      <form
        data-testid="mock-edit-profile-form"
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit({ displayName: 'New Submitted Name' });
        }}
      >
        <input aria-label="Display Name" defaultValue="Test User" />
        <button type="submit">Mock Save</button>
      </form>
    )
  );
});

// Mock react-hot-toast with all required functions
jest.mock('react-hot-toast', () => ({
  success: jest.fn(),
  error: jest.fn(),
  loading: jest.fn(),
  dismiss: jest.fn(),
  promise: jest.fn((promise, messages) => {
    // Simulate toast.promise behavior
    promise.then(() => {
      (jest.mocked(toast.success))(
        typeof messages.success === 'function' ? messages.success() : messages.success
      );
    }).catch(() => {
      (jest.mocked(toast.error))(
        typeof messages.error === 'function' ? messages.error() : messages.error
      );
    });
    if (messages.loading) {
      (jest.mocked(toast.loading))(messages.loading);
    }
    return promise;
  }),
}));

jest.mock('@/components/Auth/ProtectedRoute', () => {
  // eslint-disable-next-line react/display-name
  return ({ children }: { children: React.ReactNode }) => (
    <div data-testid="mock-protected-route">{children}</div>
  );
});

describe('EditProfilePage', () => {
  const mockUseAuthStore = useAuthStore as jest.MockedFunction<typeof useAuthStore>;
  const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;
  let mockPush: jest.Mock;
  let mockUpdateDisplayName: jest.Mock;
  const mockToastError = toast.error as jest.Mock;
  const mockToastSuccess = toast.success as jest.Mock;
  const mockToastPromise = toast.promise as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    mockPush = jest.fn();
    mockUpdateDisplayName = jest.fn();
    mockUseRouter.mockReturnValue({
      push: mockPush,
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
    } as ReturnType<typeof useRouter>);
    // Default: authenticated, non-guest, not loading
    mockUseAuthStore.mockReturnValue({
      isAuthenticated: true,
      isGuest: false,
      isLoading: false,
      userEmail: 'test@example.com',
      displayName: 'Test User',
      updateDisplayName: mockUpdateDisplayName,
      // other store methods mocked as needed
      loginRequest: jest.fn(),
      loginSuccess: jest.fn(),
      loginFailure: jest.fn(),
      loginAsGuest: jest.fn(),
      logout: jest.fn(),
      error: null,
    });
  });

  it('renders loading state initially if isLoading is true', () => {
    mockUseAuthStore.mockReturnValue({
      isAuthenticated: true,
      isGuest: false,
      isLoading: true,
      userEmail: 'test@example.com',
      displayName: 'Test User',
      updateDisplayName: mockUpdateDisplayName,
      loginRequest: jest.fn(),
      loginSuccess: jest.fn(),
      loginFailure: jest.fn(),
      loginAsGuest: jest.fn(),
      logout: jest.fn(),
      error: null,
    });
    render(<EditProfilePage />);
    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
  });

  it('redirects and shows error if not authenticated', () => {
    mockUseAuthStore.mockReturnValue({
      isAuthenticated: false,
      isGuest: false,
      isLoading: false,
      userEmail: null,
      displayName: null,
      updateDisplayName: mockUpdateDisplayName,
      loginRequest: jest.fn(),
      loginSuccess: jest.fn(),
      loginFailure: jest.fn(),
      loginAsGuest: jest.fn(),
      logout: jest.fn(),
      error: null,
    });

    render(<EditProfilePage />);
    expect(screen.queryByTestId('mock-edit-profile-form')).not.toBeInTheDocument();
    expect(mockToastError).toHaveBeenCalledWith('Access denied. Please log in.');
    expect(mockPush).toHaveBeenCalledWith('/login');
  });

  it('redirects and shows error if user is a guest', () => {
    mockUseAuthStore.mockReturnValue({
      isAuthenticated: false,
      isGuest: true,
      isLoading: false,
      userEmail: 'guest@example.com',
      displayName: 'Guest',
      updateDisplayName: mockUpdateDisplayName,
      loginRequest: jest.fn(),
      loginSuccess: jest.fn(),
      loginFailure: jest.fn(),
      loginAsGuest: jest.fn(),
      logout: jest.fn(),
      error: null,
    });

    render(<EditProfilePage />);
    expect(screen.queryByTestId('mock-edit-profile-form')).not.toBeInTheDocument();
    expect(mockToastError).toHaveBeenCalledWith('Access denied. Please log in.');
    expect(mockPush).toHaveBeenCalledWith('/login');
  });

  it('renders EditProfileForm for authenticated non-guest user with initial data', () => {
    // State already set in beforeEach for authenticated user
    render(<EditProfilePage />);
    expect(screen.getByTestId('mock-edit-profile-form')).toBeInTheDocument();
    expect(screen.getByLabelText('Display Name')).toHaveValue('Test User');
  });

  it('handleEditProfileSubmit updates display name and redirects', async () => {
    const user = userEvent.setup();
    render(<EditProfilePage />);

    // Get the button that's already in the mock form (named "Mock Save")
    const saveButton = screen.getByRole('button', { name: /mock save/i });

    // Simulate form submission
    await user.click(saveButton);

    // Verify that all promises and async operations are handled
    await waitFor(async () => {
      expect(mockUpdateDisplayName).toHaveBeenCalledWith('New Submitted Name');
      expect(mockToastPromise).toHaveBeenCalled();
      expect(mockPush).toHaveBeenCalledWith('/profile');
      expect(mockToastSuccess).toHaveBeenCalledWith('Profile updated successfully! (Dummy)');
    });
  });
});
