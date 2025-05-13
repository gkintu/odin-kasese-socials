// src/app/profile/edit/page.test.tsx
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import EditProfilePage from './page'; // Import component under test later
import { useAuthStore } from '@/lib/store/authStore'; // Will be the mocked version
import { useRouter } from 'next/navigation'; // Will be the mocked version

// 1. Mock modules that don't depend on other mocks in this file
jest.mock('@/lib/store/authStore');
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// 2. Define the individual mock functions for react-hot-toast
const mockToastErrorFn = jest.fn();
const mockToastSuccessFn = jest.fn();
const mockToastLoadingFn = jest.fn();
const mockToastDismissFn = jest.fn();
const mockToastPromiseFn = jest.fn((promise, options) => {
  if (options.loading) mockToastLoadingFn(options.loading);
  // Ensure the promise returned by toast.promise correctly resolves/rejects
  return promise.then((data: any) => { // Handle promise resolution
    const message = typeof options.success === 'function' ? options.success(data) : options.success;
    mockToastSuccessFn(message);
    return data; // Pass through resolved data
  }).catch((error: any) => { // Handle promise rejection
    const message = typeof options.error === 'function' ? options.error(error) : options.error;
    mockToastErrorFn(message);
    throw error; // Re-throw error
  });
});

// 3. Now, mock 'react-hot-toast' using the functions defined above
jest.mock('react-hot-toast', () => ({
  __esModule: true, // Important for ES Modules
  default: {
    error: mockToastErrorFn,
    success: mockToastSuccessFn,
    loading: mockToastLoadingFn,
    promise: mockToastPromiseFn,
    dismiss: mockToastDismissFn,
  },
  // If your component uses <Toaster />, you might want to mock it too
  // Toaster: () => <div data-testid="mock-toaster">Mock Toaster</div>,
}));


// 4. Describe your tests
describe('EditProfilePage', () => {
  // Type your mocks for better autocompletion and type safety
  const mockUseAuthStore = useAuthStore as jest.MockedFunction<typeof useAuthStore>;
  const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;

  let mockPush: jest.Mock;
  let mockUpdateDisplayName: jest.Mock;
  let defaultAuthStoreState: ReturnType<typeof useAuthStore>;

  beforeEach(() => {
    // Clear all mocks (including the toast functions) before each test
    jest.clearAllMocks();

    mockPush = jest.fn();
    mockUpdateDisplayName = jest.fn();

    // Setup mock return value for useRouter
    mockUseRouter.mockReturnValue({
      push: mockPush,
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
    } as any); // Using 'as any' for brevity, or be more specific with ReturnType

    // Default auth state for most tests
    defaultAuthStoreState = {
      isAuthenticated: true,
      isGuest: false,
      isLoading: false,
      userEmail: 'test@example.com',
      displayName: 'Test User',
      updateDisplayName: mockUpdateDisplayName, // Use the fresh mock
      loginRequest: jest.fn(),
      loginSuccess: jest.fn(),
      loginFailure: jest.fn(),
      loginAsGuest: jest.fn(),
      logout: jest.fn(),
      error: null,
    };
    mockUseAuthStore.mockReturnValue(defaultAuthStoreState);
  });

  it('renders loading state initially if isLoading is true', () => {
    mockUseAuthStore.mockReturnValue({
      ...defaultAuthStoreState,
      isLoading: true,
    });
    
    render(<EditProfilePage />);
    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
  });

  it('redirects and shows error if not authenticated', async () => {
    mockUseAuthStore.mockReturnValue({
      ...defaultAuthStoreState,
      isAuthenticated: false,
      isGuest: false, // ensure isGuest is false if only isAuthenticated is false
      displayName: null,
      userEmail: null,
    });

    render(<EditProfilePage />);

    await waitFor(() => {
      // Use the specific mock function
      expect(mockToastErrorFn).toHaveBeenCalledWith('Access denied. Please log in.');
      expect(mockPush).toHaveBeenCalledWith('/login');
    });
  });

  it('redirects and shows error if user is a guest', async () => {
    mockUseAuthStore.mockReturnValue({
      ...defaultAuthStoreState,
      isAuthenticated: true, // A guest might still be "authenticated" in some sense
      isGuest: true,
    });

    render(<EditProfilePage />);

    await waitFor(() => {
      expect(mockToastErrorFn).toHaveBeenCalledWith('Access denied. Please log in.');
      expect(mockPush).toHaveBeenCalledWith('/login');
    });
  });

  it('renders EditProfileForm for authenticated non-guest user with initial data', () => {
    // Ensure default state is used (authenticated, not guest)
    mockUseAuthStore.mockReturnValue(defaultAuthStoreState);
    render(<EditProfilePage />);
    expect(screen.getByTestId('mock-edit-profile-form')).toBeInTheDocument();
    // This assumes your mocked EditProfileForm renders an input with this label and sets its value
    expect(screen.getByLabelText('Display Name')).toHaveValue('Test User');
  });

  it('handleEditProfileSubmit updates display name and redirects', async () => {
    const user = userEvent.setup();
    // Ensure updateDisplayName returns a promise so toast.promise can work with it
    mockUpdateDisplayName.mockResolvedValueOnce(undefined); // Or some success data if your success handler uses it

    render(<EditProfilePage />);

    const saveButton = screen.getByRole('button', { name: /mock save/i });
    await user.click(saveButton);

    // 1. Check for loading toast
    await waitFor(() => {
      expect(mockToastLoadingFn).toHaveBeenCalledWith('Updating profile...');
    });
    
    // 2. Check if the core update function was called
    // This might happen before or after the loading toast is fully processed by waitFor,
    // depending on the component's implementation.
    // If toast.promise wraps the call to updateDisplayName, then updateDisplayName
    // will be called as part of resolving the promise argument to toast.promise.
    await waitFor(() => {
        // This relies on your mocked EditProfileForm calling its onSubmit prop
        // with { displayName: 'New Submitted Name' }
        expect(mockUpdateDisplayName).toHaveBeenCalledWith('New Submitted Name');
    });

    // 3. Check for success toast and redirection
    await waitFor(() => {
      expect(mockToastSuccessFn).toHaveBeenCalledWith('Profile updated successfully! (Dummy)');
      expect(mockPush).toHaveBeenCalledWith('/profile');
    });
  });
});