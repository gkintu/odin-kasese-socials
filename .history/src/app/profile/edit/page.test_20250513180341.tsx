import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// --- Declare types for our mock functions for clarity (optional but good practice) ---
type JestMockFn = jest.Mock<any, any[]>; // Corrected type

interface MockToastInterface {
  error: JestMockFn;
  success: JestMockFn;
  loading: JestMockFn;
  promise: JestMockFn;
  dismiss: JestMockFn;
}

interface AuthStoreStateActions {
  isAuthenticated: boolean;
  isGuest: boolean;
  isLoading: boolean;
  userEmail: string | null;
  displayName: string | null;
  updateDisplayName: jest.Mock<any, any[]>; // Consistent type
  loginRequest: jest.Mock<any, any[]>;
  loginSuccess: jest.Mock<any, any[]>;
  loginFailure: jest.Mock<any, any[]>;
  loginAsGuest: jest.Mock<any, any[]>;
  logout: jest.Mock<any, any[]>;
  error: string | null;
}

// --- Define Mocks Object for react-hot-toast ---
const toastMocksContainer = {
  error: jest.fn(),
  success: jest.fn(),
  loading: jest.fn(),
  dismiss: jest.fn(),
  promise: jest.fn(), // Defined properly below
};

// Define the promise mock implementation referencing the container
toastMocksContainer.promise = jest.fn().mockImplementation((promise, options) => {
  if (options.loading) toastMocksContainer.loading(options.loading);
  return promise
    .then((data: unknown) => {
      const message =
        typeof options.success === 'function'
          ? options.success(data)
          : options.success;
      toastMocksContainer.success(message);
      return data;
    })
    .catch((error: unknown) => {
      const message =
        typeof options.error === 'function'
          ? options.error(error)
          : options.error;
      toastMocksContainer.error(message);
      throw error;
    });
});

// --- Mock react-hot-toast ---
jest.mock('react-hot-toast', () => ({
  __esModule: true,
  default: toastMocksContainer, // Use the fully initialized container
  Toaster: () => <div data-testid="mock-toaster" />,
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
import toast from 'react-hot-toast'; // This will be our mocked toast object (toastMocksContainer)

// Cast the imported toast to our MockToastInterface for type safety in tests
const mockedToast = toast as unknown as MockToastInterface;

// --- Describe Tests ---
describe('EditProfilePage', () => {
  const mockUseAuthStore = useAuthStore as jest.MockedFunction<
    typeof useAuthStore
  >;
  const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;

  let mockPush: jest.Mock<any, any[]>; // Consistent type
  let mockUpdateDisplayName: jest.Mock<any, any[]>; // Consistent type
  let defaultAuthStoreState: AuthStoreStateActions;

  beforeEach(() => {
    // Clear all mocks. This will clear the call history of functions in toastMocksContainer.
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
      ...(defaultAuthStoreState as AuthStoreStateActions), // Ensure type safety
      isAuthenticated: false,
      isGuest: false,
      displayName: null,
      userEmail: null,
    });

    render(<EditProfilePage />);

    await waitFor(() => {
      // Use the methods from the imported mockedToast (which points to toastMocksContainer)
      expect(mockedToast.error).toHaveBeenCalledWith(
        'Access denied. Please log in.'
      );
      expect(mockPush).toHaveBeenCalledWith('/login');
    });
  });

  it('redirects and shows error if user is a guest', async () => {
    mockUseAuthStore.mockReturnValue({
      ...(defaultAuthStoreState as AuthStoreStateActions), // Ensure type safety
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
