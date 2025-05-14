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
  promise: jest.fn(),
}));

// Mock authStore
jest.mock('@/lib/store/authStore');

// Mock EditProfileForm component
jest.mock('@/components/profile/EditProfileForm', () => ({
  __esModule: true,
  default: ({ onSubmit, initialData }: { onSubmit: (data: EditProfileFormValues) => void; initialData: EditProfileFormValues }) => (
    <form data-testid="edit-profile-form" onSubmit={(e) => {
      e.preventDefault();
      onSubmit(initialData); // Simulate form submission with initial data for simplicity
    }}>
      <input type="text" defaultValue={initialData.displayName} data-testid="displayName-input" />
      <button type="submit">Submit</button>
    </form>
  ),
}));


describe('EditProfilePage', () => {
  let mockRouterPush: jest.Mock;
  let mockUpdateDisplayName: jest.Mock;

  beforeEach(() => {
    mockRouterPush = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push: mockRouterPush });

    mockUpdateDisplayName = jest.fn();
    (useAuthStore as unknown as jest.Mock).mockReturnValue({
      isAuthenticated: true,
      isGuest: false,
      userEmail: 'test@example.com',
      isLoading: false,
      displayName: 'CurrentName',
      updateDisplayName: mockUpdateDisplayName,
    });
    (toast.promise as jest.Mock).mockImplementation((promise, { success, error }) => {
      return promise.then(success).catch(error);
    });
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

    await waitFor(() => {
      expect(mockUpdateDisplayName).not.toHaveBeenCalled();
    });
    
    await waitFor(() => {
      expect(toast.promise).toHaveBeenCalled();
    });
    
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
    const mockSubmitData = { displayName: 'NewName', bio: 'bio', profilePictureUrl: 'url' };
    
    const MockForm = ({ onSubmit }: { onSubmit: (data: EditProfileFormValues) => void; initialData: EditProfileFormValues }) => (
        <form data-testid="edit-profile-form-custom-submit" onSubmit={(e) => {
          e.preventDefault();
          onSubmit(mockSubmitData); 
        }}>
          <button type="submit">Submit</button>
        </form>
      );
    jest.doMock('@/components/profile/EditProfileForm', () => ({
        __esModule: true,
        default: MockForm,
    }), { virtual: true });

    (useAuthStore as unknown as jest.Mock).mockReturnValue({
        isAuthenticated: true,
        isGuest: false,
        userEmail: 'test@example.com',
        isLoading: false,
        displayName: 'OldName',
        updateDisplayName: mockUpdateDisplayName,
      });

    render(<EditProfilePage />);
    fireEvent.submit(screen.getByTestId('edit-profile-form-custom-submit'));

    await waitFor(() => {
      expect(mockUpdateDisplayName).toHaveBeenCalledWith('NewName');
    });
    await waitFor(() => {
        expect(mockRouterPush).toHaveBeenCalledWith('/profile');
    });
    jest.dontMock('@/components/profile/EditProfileForm');
  });

  it('does not update display name if it has not changed', async () => {
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
