import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import EditProfilePage from './page';
import { useAuthStore } from '@/lib/store/authStore';
import type { EditProfileFormValues } from '@/components/profile/EditProfileForm';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock react-hot-toast
jest.mock('react-hot-toast', () => ({
  success: jest.fn(),
  error: jest.fn(),
  promise: jest.fn(), // Will be further implemented in beforeEach
}));

// Mock authStore
jest.mock('@/lib/store/authStore');

// Variable to control submitted data for the EditProfileForm mock
let mockSubmittedEditProfileData: EditProfileFormValues | undefined;

// Mock EditProfileForm component
jest.mock('@/components/profile/EditProfileForm', () => ({
  __esModule: true,
  default: ({ onSubmit, initialData }: { onSubmit: (data: EditProfileFormValues) => void; initialData: EditProfileFormValues }) => {
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      // Use overridden data if provided for the test, otherwise use initialData from props
      onSubmit(mockSubmittedEditProfileData || initialData);
    };
    return (
      <form data-testid="edit-profile-form" onSubmit={handleSubmit}>
        <input type="text" defaultValue={initialData.displayName} data-testid="displayName-input" />
        <button type="submit">Submit</button>
      </form>
    );
  },
}));

describe('EditProfilePage', () => {
  let mockRouterPush: jest.Mock;
  let mockUpdateDisplayName: jest.Mock;

  beforeEach(() => {
    mockRouterPush = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push: mockRouterPush });

    mockUpdateDisplayName = jest.fn().mockResolvedValue(undefined); // Ensure it returns a promise
    (useAuthStore as unknown as jest.Mock).mockReturnValue({
      isAuthenticated: true,
      isGuest: false,
      userEmail: 'test@example.com',
      isLoading: false,
      displayName: 'CurrentName',
      updateDisplayName: mockUpdateDisplayName,
    });
    // More accurate mock for toast.promise
    (toast.promise as jest.Mock).mockImplementation((promiseToWatch, _options) => {
      return promiseToWatch; // Simulate toast.promise returning the original promise's outcome
    });
    mockSubmittedEditProfileData = undefined; // Reset for each test
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state', () => {
    (useAuthStore as unknown as jest.Mock).mockReturnValueOnce({
      isAuthenticated: true,
      isGuest: false,
      userEmail: 'test@example.com',
      displayName: 'CurrentName',
      updateDisplayName: mockUpdateDisplayName,
      isLoading: true,
    });
    render(<EditProfilePage />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders access restricted for unauthenticated users', () => {
    (useAuthStore as unknown as jest.Mock).mockReturnValueOnce({
      isLoading: false,
      isAuthenticated: false,
      isGuest: false,
      userEmail: 'test@example.com',
      displayName: 'CurrentName',
      updateDisplayName: mockUpdateDisplayName,
    });
    render(<EditProfilePage />);
    expect(screen.getByText('Access restricted.')).toBeInTheDocument();
  });

  it('renders access restricted for guest users', () => {
    (useAuthStore as unknown as jest.Mock).mockReturnValueOnce({
      isLoading: false,
      isAuthenticated: true,
      isGuest: true,
      userEmail: 'test@example.com',
      displayName: 'CurrentName',
      updateDisplayName: mockUpdateDisplayName,
    });
    render(<EditProfilePage />);
    expect(screen.getByText('Access restricted.')).toBeInTheDocument();
  });

  it('renders edit profile form for authenticated users', () => {
    render(<EditProfilePage />);
    expect(screen.getByText('Edit Your Profile')).toBeInTheDocument();
    expect(screen.getByTestId('edit-profile-form')).toBeInTheDocument();
    expect(screen.getByTestId('displayName-input')).toHaveValue('CurrentName');
  });

  it('uses userEmail to derive displayName if displayName is not set', () => {
    (useAuthStore as unknown as jest.Mock).mockReturnValueOnce({
      isAuthenticated: true,
      isGuest: false,
      userEmail: 'testuser@example.com',
      isLoading: false,
      displayName: null,
      updateDisplayName: mockUpdateDisplayName,
    });
    render(<EditProfilePage />);
    expect(screen.getByTestId('displayName-input')).toHaveValue('testuser');
  });

  it('handles profile update successfully', async () => {
    render(<EditProfilePage />);
    
    fireEvent.submit(screen.getByTestId('edit-profile-form'));

    // Display name is 'CurrentName', initialData is 'CurrentName', so updateDisplayName should not be called.
    await waitFor(() => {
      expect(mockUpdateDisplayName).not.toHaveBeenCalled();
    });
    
    await waitFor(() => {
      expect(toast.promise).toHaveBeenCalled();
    });
    
    // Since updatePromise would be Promise.resolve(), toast.promise resolves, then push is called.
    await waitFor(() => {
        expect(mockRouterPush).toHaveBeenCalledWith('/profile');
    });
  });

  it('redirects to login and shows error if trying to submit when not authenticated', async () => {
    (useAuthStore as unknown as jest.Mock).mockReturnValueOnce({
      isLoading: false,
      isAuthenticated: false,
      isGuest: false,
      userEmail: 'test@example.com',
      displayName: 'CurrentName',
      updateDisplayName: mockUpdateDisplayName,
    });
    render(<EditProfilePage />);
    expect(screen.getByText('Access restricted.')).toBeInTheDocument();
  });
  
  it('updates display name if it has changed', async () => {
    // Set the data that the mock form should "submit"
    mockSubmittedEditProfileData = { displayName: 'NewName', bio: 'A new bio', profilePictureUrl: 'new_url.jpg' };
    
    (useAuthStore as unknown as jest.Mock).mockReturnValue({
        isAuthenticated: true,
        isGuest: false,
        userEmail: 'test@example.com',
        isLoading: false,
        displayName: 'OldName', // Initial name in store, different from 'NewName'
        updateDisplayName: mockUpdateDisplayName,
      });

    render(<EditProfilePage />);
    // The mocked EditProfileForm will use 'edit-profile-form' as its data-testid
    // and will call onSubmit with mockSubmittedEditProfileData.
    fireEvent.submit(screen.getByTestId('edit-profile-form'));

    await waitFor(() => {
      // updateDisplayName should be called because 'NewName' (from mockSubmittedEditProfileData)
      // is different from 'OldName' (initialDisplayName derived from store).
      expect(mockUpdateDisplayName).toHaveBeenCalledWith('NewName');
    });
    await waitFor(() => {
        expect(mockRouterPush).toHaveBeenCalledWith('/profile');
    });
    // No jest.doMock or jest.dontMock needed anymore
  });

  it('does not update display name if it has not changed', async () => {
    // displayName in store is 'CurrentName'
    // mockSubmittedEditProfileData is undefined, so form submits initialData { displayName: 'CurrentName' }
    render(<EditProfilePage />); 
    fireEvent.submit(screen.getByTestId('edit-profile-form'));

    await waitFor(() => {
      expect(mockUpdateDisplayName).not.toHaveBeenCalled();
    });
     await waitFor(() => {
        expect(mockRouterPush).toHaveBeenCalledWith('/profile');
    });
  });

});

// Helper to ensure Jest types are happy with mock implementations
declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R;
    }
  }
}
