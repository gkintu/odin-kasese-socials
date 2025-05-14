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
    <form data-testid="mock-edit-profile-form" onSubmit={(e) => {
      e.preventDefault();
      onSubmit(initialData); // Simulate form submission with initial data for simplicity
    }}>
      <input type="text" defaultValue={initialData.displayName} data-testid="displayName-input" />
      <button type="submit">Submit</button>
    </form>
  ),
}));

describe('EditProfilePage', () => {
  const mockUseAuthStore = useAuthStore as jest.MockedFunction<typeof useAuthStore>;
  const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;
  let mockPush: jest.Mock;
  let mockUpdateDisplayName: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
    mockPush = jest.fn();
    mockUpdateDisplayName = jest.fn().mockResolvedValue(undefined);
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
      displayName: 'CurrentName',
      updateDisplayName: mockUpdateDisplayName,
      loginRequest: jest.fn(),
      loginSuccess: jest.fn(),
      loginFailure: jest.fn(),
      signupRequest: jest.fn(),
      signupSuccess: jest.fn(),
      signupFailure: jest.fn(),
      logout: jest.fn(),
    });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders loading state', () => {
    mockUseAuthStore.mockReturnValueOnce({
      isAuthenticated: true,
      isGuest: false,
      userEmail: 'test@example.com',
      displayName: 'CurrentName',
      updateDisplayName: mockUpdateDisplayName,
      isLoading: true,
    } as ReturnType<typeof useAuthStore>);
    render(<EditProfilePage />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders access restricted for unauthenticated users', () => {
    mockUseAuthStore.mockReturnValueOnce({
      isLoading: false,
      isAuthenticated: false,
      isGuest: false,
      userEmail: 'test@example.com',
      displayName: 'CurrentName',
      updateDisplayName: mockUpdateDisplayName,
    } as ReturnType<typeof useAuthStore>);
    render(<EditProfilePage />);
    expect(screen.getByText('Access restricted.')).toBeInTheDocument();
  });

  it('renders access restricted for guest users', () => {
    mockUseAuthStore.mockReturnValueOnce({
      isLoading: false,
      isAuthenticated: true,
      isGuest: true,
      userEmail: 'test@example.com',
      displayName: 'CurrentName',
      updateDisplayName: mockUpdateDisplayName,
    } as ReturnType<typeof useAuthStore>);
    render(<EditProfilePage />);
    expect(screen.getByText('Access restricted.')).toBeInTheDocument();
  });

  it('renders edit profile form for authenticated users', () => {
    render(<EditProfilePage />);
    expect(screen.getByText('Edit Your Profile')).toBeInTheDocument();
    expect(screen.getByTestId('mock-edit-profile-form')).toBeInTheDocument();
  });

  it('uses userEmail to derive displayName if displayName is not set', () => {
    mockUseAuthStore.mockReturnValueOnce({
      isAuthenticated: true,
      isGuest: false,
      userEmail: 'testuser@example.com',
      isLoading: false,
      displayName: null,
      updateDisplayName: mockUpdateDisplayName,
    } as ReturnType<typeof useAuthStore>);
    render(<EditProfilePage />);
    expect(screen.getByTestId('mock-edit-profile-form')).toBeInTheDocument();
  });

  it('handles profile update successfully', async () => {
    render(<EditProfilePage />);
    fireEvent.submit(screen.getByTestId('mock-edit-profile-form'));
    
    // Fast-forward setTimeout
    jest.advanceTimersByTime(1000);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/profile');
    });
  });

  it('updates display name if it has changed', async () => {
    mockUseAuthStore.mockReturnValue({
      isAuthenticated: true,
      isGuest: false,
      userEmail: 'test@example.com',
      isLoading: false,
      displayName: 'OldName',
      updateDisplayName: mockUpdateDisplayName,
      loginRequest: jest.fn(),
      loginSuccess: jest.fn(),
      loginFailure: jest.fn(),
      signupRequest: jest.fn(),
      signupSuccess: jest.fn(),
      signupFailure: jest.fn(),
      logout: jest.fn(),
    });

    render(<EditProfilePage />);
    fireEvent.submit(screen.getByTestId('mock-edit-profile-form'));

    // Fast-forward setTimeout
    jest.advanceTimersByTime(1000);
    
    await waitFor(() => {
      expect(mockUpdateDisplayName).toHaveBeenCalledWith('New Submitted Name');
    });

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/profile');
    });
  });

  it('does not update display name if it has not changed', async () => {
    render(<EditProfilePage />);
    fireEvent.submit(screen.getByTestId('mock-edit-profile-form'));

    // Fast-forward setTimeout
    jest.advanceTimersByTime(1000);

    await waitFor(() => {
      expect(mockUpdateDisplayName).not.toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/profile');
    });
  });
});
