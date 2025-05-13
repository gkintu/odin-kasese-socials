import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// --- START: Define toast mock functions FIRST ---
const mockToastErrorFn = jest.fn();
const mockToastSuccessFn = jest.fn();
const mockToastLoadingFn = jest.fn();
const mockToastDismissFn = jest.fn();
const mockToastPromiseFn = jest.fn((promise, options) => {
  if (options.loading) mockToastLoadingFn(options.loading);
  return promise.then((data: any) => {
    const message = typeof options.success === 'function' ? options.success(data) : options.success;
    mockToastSuccessFn(message);
    return data;
  }).catch((error: any) => {
    const message = typeof options.error === 'function' ? options.error(error) : options.error;
    mockToastErrorFn(message);
    throw error;
  });
});
// --- END: Define toast mock functions FIRST ---


// --- START: Mock modules AFTER defining functions used in their factories ---
jest.mock('react-hot-toast', () => ({
  __esModule: true,
  default: {
    error: mockToastErrorFn,
    success: mockToastSuccessFn,
    loading: mockToastLoadingFn,
    promise: mockToastPromiseFn,
    dismiss: mockToastDismissFn,
  },
  // Toaster: () => <div data-testid="mock-toaster">Mock Toaster</div>,
}));

jest.mock('@/lib/store/authStore');
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// --- END: Mock modules ---

// --- NOW, import your components and other utilities ---
import EditProfilePage from './page'; // THIS IMPORT MIGHT TRIGGER THE MOCK EVALUATION
import { useAuthStore } from '@/lib/store/authStore';
import { useRouter } from 'next/navigation';
// DO NOT import 'toast' directly here IF it's already mocked above.
// import toast from 'react-hot-toast'; // <-- Remove this line if present

// The rest of your describe block and tests...
describe('EditProfilePage', () => {
  const mockUseAuthStore = useAuthStore as jest.MockedFunction<typeof useAuthStore>;
  const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;

  let mockPush: jest.Mock;
  let mockUpdateDisplayName: jest.Mock;
  let defaultAuthStoreState: ReturnType<typeof useAuthStore>;

  beforeEach(() => {
    jest.clearAllMocks(); // This will clear mockToastErrorFn, etc.

    mockPush = jest.fn();
    mockUpdateDisplayName = jest.fn();

    mockUseRouter.mockReturnValue({
      push: mockPush,
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
    } as any);

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

  // ... your tests ...
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
      expect(mockToastErrorFn).toHaveBeenCalledWith('Access denied. Please log in.');
      expect(mockPush).toHaveBeenCalledWith('/login');
    });
  });

  it('redirects and shows error if user is a guest', async () => {
    mockUseAuthStore.mockReturnValue({
      ...defaultAuthStoreState,
      // For a guest, isAuthenticated might be true or false depending on your app's logic
      // The key is isGuest: true
      isAuthenticated: true, 
      isGuest: true,
    });

    render(<EditProfilePage />);

    await waitFor(() => {
      expect(mockToastErrorFn).toHaveBeenCalledWith('Access denied. Please log in.');
      expect(mockPush).toHaveBeenCalledWith('/login');
    });
  });

  it('renders EditProfileForm for authenticated non-guest user with initial data', () => {
    mockUseAuthStore.mockReturnValue(defaultAuthStoreState);
    // You'll need to mock EditProfileForm if it's not already
    // jest.mock('@/components/profile/EditProfileForm', () => {
    //   return jest.fn(({ initialData, onSubmit, isSubmitting }) => (
    //     <form data-testid="mock-edit-profile-form" onSubmit={(e) => { e.preventDefault(); onSubmit({ displayName: 'New Submitted Name' }); }}>
    //       <label htmlFor="displayName">Display Name</label>
    //       <input id="displayName" name="displayName" defaultValue={initialData.displayName} />
    //       <button type="submit" disabled={isSubmitting}>Mock Save</button>
    //     </form>
    //   ));
    // });

    render(<EditProfilePage />);
    expect(screen.getByTestId('mock-edit-profile-form')).toBeInTheDocument();
    expect(screen.getByLabelText('Display Name')).toHaveValue('Test User');
  });

  it('handleEditProfileSubmit updates display name and redirects', async () => {
    const user = userEvent.setup();
    mockUpdateDisplayName.mockResolvedValueOnce(undefined); 

    // Make sure EditProfileForm is mocked to call onSubmit correctly
    // If EditProfileForm is not mocked elsewhere, you might need a specific mock here:
    // jest.mock('@/components/profile/EditProfileForm', () => {
    //   return jest.fn(({ onSubmit }) => (
    //     <form data-testid="mock-edit-profile-form" onSubmit={(e) => { e.preventDefault(); onSubmit({ displayName: 'New Submitted Name' }); }}>
    //       <button type="submit">Mock Save</button>
    //     </form>
    //   ));
    // });
    // If EditProfileForm is auto-mocked via a __mocks__ folder, ensure it behaves as needed.


    render(<EditProfilePage />);

    const saveButton = screen.getByRole('button', { name: /mock save/i });
    await user.click(saveButton);

    await waitFor(() => {
      expect(mockToastLoadingFn).toHaveBeenCalledWith('Updating profile...');
    });
    
    await waitFor(() => {
        expect(mockUpdateDisplayName).toHaveBeenCalledWith('New Submitted Name');
    });

    await waitFor(() => {
      expect(mockToastSuccessFn).toHaveBeenCalledWith('Profile updated successfully! (Dummy)');
      expect(mockPush).toHaveBeenCalledWith('/profile');
    });
  });
});