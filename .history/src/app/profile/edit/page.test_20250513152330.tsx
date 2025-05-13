import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// --- Declare types for our mock functions for clarity (optional but good practice) ---
// Updated JestMockFn type to use jest.Mock<unknown, unknown> instead of jest.Mock<any, any>.
type JestMockFn = jest.Mock<unknown, unknown>;

interface MockToast {
  error: JestMockFn;
  success: JestMockFn;
  loading: JestMockFn;
  promise: JestMockFn;
  dismiss: JestMockFn;
}

// --- Mock react-hot-toast ---
// The factory now defines its own mocks and returns them.
// We will access these mocks later by importing 'react-hot-toast'
// (which will resolve to this mock).
const actualMockError = jest.fn();
const actualMockSuccess = jest.fn();
const actualMockLoading = jest.fn();
const actualMockDismiss = jest.fn();
const actualMockPromise = jest.fn().mockImplementation((promise, options) => {
  if (options.loading) actualMockLoading(options.loading);
  return promise
    .then((data: unknown) => {
      const message =
        typeof options.success === 'function'
          ? options.success(data)
          : options.success;
      actualMockSuccess(message);
      return data;
    })
    .catch((error: unknown) => {
      const message =
        typeof options.error === 'function'
          ? options.error(error)
          : options.error;
      actualMockError(message);
      throw error;
    });
});

jest.mock('react-hot-toast', () => ({
  __esModule: true,
  default: {
    error: actualMockError,
    success: actualMockSuccess,
    loading: actualMockLoading,
    promise: actualMockPromise,
    dismiss: actualMockDismiss,
  },
  // Toaster: () => <div data-testid="mock-toaster">Mock Toaster</div>,
}));

// --- Mock other dependencies ---
jest.mock('@/lib/store/authStore');
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// --- Mock EditProfileForm (IMPORTANT: Place before importing EditProfilePage) ---
jest.mock('@/components/profile/EditProfileForm', () => {
  return jest.fn(({ initialData, onSubmit }) => (
    <form
      data-testid="mock-edit-profile-form"
      onSubmit={(e) => {
        e.preventDefault();
        // This value MUST match what the submit test expects
        onSubmit({ displayName: 'New Submitted Name' });
      }}
    >
      <label htmlFor="displayName-mock">Display Name</label>
      <input
        id="displayName-mock"
        name="displayName"
        defaultValue={initialData?.displayName || ''}
        aria-label="Display Name"
      />
      <button type="submit">Mock Save</button>
    </form>
  ));
});

// --- Import the component under test and other necessary modules AFTER mocks ---
import EditProfilePage from './page';
import { useAuthStore } from '@/lib/store/authStore';
import { useRouter } from 'next/navigation';
// Import the mocked toast to access its mock functions for assertions
import toast from 'react-hot-toast'; // This will be our mocked toast object

// Cast the imported toast to our MockToast interface for type safety in tests
const mockedToast = toast as unknown as MockToast;

// --- Describe Tests ---
describe('EditProfilePage', () => {
  const mockUseAuthStore = useAuthStore as jest.MockedFunction<
    typeof useAuthStore
  >;
  const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;

  let mockPush: jest.Mock;
  let mockUpdateDisplayName: jest.Mock;
  let defaultAuthStoreState: ReturnType<typeof useAuthStore>;

  beforeEach(() => {
    // Clear all mocks. This will clear the call history of actualMockError etc.
    // because they are the functions directly returned by the mock.
    jest.clearAllMocks();

    mockPush = jest.fn();
    mockUpdateDisplayName = jest.fn();

    // Updated mockUseRouter.mockReturnValue to use a more specific type instead of 'as any'.
    mockUseRouter.mockReturnValue({
      push: mockPush,
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
    } as Partial<ReturnType<typeof useRouter>>);

    defaultAuthStoreState = {
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
      isGuest: false,
      displayName: null,
      userEmail: null,
    });

    render(<EditProfilePage />);

    await waitFor(() => {
      // Use the methods from the imported mockedToast
      expect(mockedToast.error).toHaveBeenCalledWith(
        'Access denied. Please log in.'
      );
      expect(mockPush).toHaveBeenCalledWith('/login');
    });
  });

  it('redirects and shows error if user is a guest', async () => {
    mockUseAuthStore.mockReturnValue({
      ...defaultAuthStoreState,
      isAuthenticated: true,
      isGuest: true,
    });

    render(<EditProfilePage />);

    await waitFor(() => {
      expect(mockedToast.error).toHaveBeenCalledWith(
        'Access denied. Please log in.'
      );
      expect(mockPush).toHaveBeenCalledWith('/login');
    });
  });

  it('renders EditProfileForm for authenticated non-guest user with initial data', () => {
    mockUseAuthStore.mockReturnValue(defaultAuthStoreState);
    render(<EditProfilePage />);
    expect(screen.getByTestId('mock-edit-profile-form')).toBeInTheDocument();
    expect(screen.getByLabelText('Display Name')).toHaveValue('Test User');
  });

  it('handleEditProfileSubmit updates display name and redirects', async () => {
    const user = userEvent.setup();
    // updateDisplayName is called inside a setTimeout in the component's handler.
    // It doesn't need to be a promise itself for toast.promise to work on the *outer* promise.
    // mockUpdateDisplayName.mockResolvedValueOnce(undefined); // Not strictly needed if it's sync

    render(<EditProfilePage />);

    const saveButton = screen.getByRole('button', { name: /mock save/i }); // From mock EditProfileForm
    await user.click(saveButton);

    // 1. Loading toast
    // The toast.promise in component calls its loading callback synchronously.
    expect(mockedToast.loading).toHaveBeenCalledWith('Updating profile...');

    // 2. Wait for async operations in handleEditProfileSubmit
    // (setTimeout and updateDisplayName call)
    await waitFor(() => {
      expect(mockUpdateDisplayName).toHaveBeenCalledWith('New Submitted Name');
    });

    // 3. Success toast and redirection (after the promise in handleEditProfileSubmit resolves)
    await waitFor(() => {
      expect(mockedToast.success).toHaveBeenCalledWith(
        'Profile updated successfully! (Dummy)'
      );
      expect(mockPush).toHaveBeenCalledWith('/profile');
    });
  });
});
