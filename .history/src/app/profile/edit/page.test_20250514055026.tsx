import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
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
  toast: jest.fn(),
  promise: jest.fn().mockImplementation((promise, messages) => {
    return Promise.resolve(promise).then(() => {
      if (messages.success) messages.success();
      return promise;
    });
  }),
}));

// Mock authStore
jest.mock('@/lib/store/authStore');

// Mock EditProfileForm component
jest.mock('@/components/profile/EditProfileForm', () => ({
  __esModule: true,
  default: ({ onSubmit }: { onSubmit: (data: { displayName: string }) => void }) => (
    <form
      data-testid="mock-edit-profile-form"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit({ displayName: 'New Submitted Name' });
      }}
    >
      <input data-testid="displayName-input" type="text" />
      <button type="submit">Submit</button>
    </form>
  ),
}));

// Mock ProtectedRoute component
jest.mock('@/components/Auth/ProtectedRoute', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="mock-protected-route">{children}</div>
  ),
}));

describe('EditProfilePage', () => {
  const mockUseAuthStore = useAuthStore as jest.MockedFunction<typeof useAuthStore>;
  const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;
  let mockPush: jest.Mock;
  let mockUpdateDisplayName: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
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
    jest.clearAllMocks();
  });

  it('renders loading state', () => {
    mockUseAuthStore.mockReturnValueOnce({
      ...mockUseAuthStore(),
      isLoading: true,
    });
    render(<EditProfilePage />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders access restricted for unauthenticated users', () => {
    mockUseAuthStore.mockReturnValueOnce({
      ...mockUseAuthStore(),
      isAuthenticated: false,
    });
    render(<EditProfilePage />);
    expect(screen.getByText('Access restricted.')).toBeInTheDocument();
  });

  it('renders access restricted for guest users', () => {
    mockUseAuthStore.mockReturnValueOnce({
      ...mockUseAuthStore(),
      isGuest: true,
    });
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
      ...mockUseAuthStore(),
      displayName: null,
      userEmail: 'testuser@example.com',
    });
    render(<EditProfilePage />);
    expect(screen.getByTestId('mock-edit-profile-form')).toBeInTheDocument();
  });

  it('handles profile update successfully', async () => {
    render(<EditProfilePage />);
    await act(async () => {
      fireEvent.submit(screen.getByTestId('mock-edit-profile-form'));
    });

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/profile');
    });
  });

  it('updates display name if it has changed', async () => {
    mockUseAuthStore.mockReturnValue({
      ...mockUseAuthStore(),
      displayName: 'OldName',
    });

    render(<EditProfilePage />);
    
    await act(async () => {
      fireEvent.submit(screen.getByTestId('mock-edit-profile-form'));
    });

    await waitFor(() => {
      expect(mockUpdateDisplayName).toHaveBeenCalledWith('New Submitted Name');
      expect(mockPush).toHaveBeenCalledWith('/profile');
    });
  });

  it('does not update display name if it has not changed', async () => {
    mockUseAuthStore.mockReturnValue({
      ...mockUseAuthStore(),
      displayName: 'New Submitted Name',
    });

    render(<EditProfilePage />);
    
    await act(async () => {
      fireEvent.submit(screen.getByTestId('mock-edit-profile-form'));
    });

    await waitFor(() => {
      expect(mockUpdateDisplayName).not.toHaveBeenCalled();
      expect(mockPush).toHaveBeenCalledWith('/profile');
    });
  });
});
