// src/app/profile/edit/page.test.tsx
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import EditProfilePage from './page';
import { useAuthStore } from '@/lib/store/authStore';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

jest.mock('@/lib/store/authStore');
jest.mock('next/navigation', () => ({ useRouter: jest.fn() }));

var mockToast;
jest.mock('react-hot-toast', () => {
  mockToast = {
    error: jest.fn(),
    success: jest.fn(),
    loading: jest.fn(),
    promise: jest.fn((promise, options) => {
      if (options.loading) mockToast.loading(options.loading);
      promise.then(() => {
        const successMessage = typeof options.success === 'function' ? options.success() : options.success;
        mockToast.success(successMessage);
      }).catch(() => {
        const errorMessage = typeof options.error === 'function' ? options.error() : options.error;
        mockToast.error(errorMessage);
      });
      return promise;
    }),
    dismiss: jest.fn(),
  };
  return {
    __esModule: true,
    default: mockToast,
  };
});

describe('EditProfilePage', () => {
  const mockUseAuthStore = useAuthStore as jest.MockedFunction<typeof useAuthStore>;
  const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;
  let mockPush: jest.Mock;
  let mockUpdateDisplayName: jest.Mock;

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

    // Default auth state
    mockUseAuthStore.mockReturnValue({
      isAuthenticated: true,
      isGuest: false,
      isLoading: false,
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
  });

  it('renders loading state initially if isLoading is true', () => {
    mockUseAuthStore.mockReturnValue({
      ...mockUseAuthStore(),
      isLoading: true,
    });
    
    render(<EditProfilePage />);
    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
  });

  it('redirects and shows error if not authenticated', async () => {
    mockUseAuthStore.mockReturnValue({
      ...mockUseAuthStore(),
      isAuthenticated: false,
      displayName: null,
      userEmail: null,
    });

    render(<EditProfilePage />);

    // Should show error and redirect
    await waitFor(() => {
      expect(mockToast.error).toHaveBeenCalledWith('Access denied. Please log in.');
      expect(mockPush).toHaveBeenCalledWith('/login');
    });
  });

  it('redirects and shows error if user is a guest', async () => {
    mockUseAuthStore.mockReturnValue({
      ...mockUseAuthStore(),
      isAuthenticated: false,
      isGuest: true,
    });

    render(<EditProfilePage />);

    // Should show error and redirect
    await waitFor(() => {
      expect(mockToast.error).toHaveBeenCalledWith('Access denied. Please log in.');
      expect(mockPush).toHaveBeenCalledWith('/login');
    });
  });

  it('renders EditProfileForm for authenticated non-guest user with initial data', () => {
    render(<EditProfilePage />);
    expect(screen.getByTestId('mock-edit-profile-form')).toBeInTheDocument();
    expect(screen.getByLabelText('Display Name')).toHaveValue('Test User');
  });

  it('handleEditProfileSubmit updates display name and redirects', async () => {
    const user = userEvent.setup();
    render(<EditProfilePage />);

    // Get the button that's already in the mock form
    const saveButton = screen.getByRole('button', { name: /mock save/i });

    // Submit the form
    await user.click(saveButton);

    // Wait for all async operations to complete
    await waitFor(() => {
      expect(mockUpdateDisplayName).toHaveBeenCalledWith('New Submitted Name');
    });

    await waitFor(() => {
      expect(mockToast.loading).toHaveBeenCalledWith('Updating profile...');
      expect(mockToast.success).toHaveBeenCalledWith('Profile updated successfully! (Dummy)');
      expect(mockPush).toHaveBeenCalledWith('/profile');
    });
  });
});
