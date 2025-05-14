// filepath: /home/kgk256/repos/odin-kasese-socials/src/app/profile/edit/page.test.tsx
import React from 'react';
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import EditProfilePage from './page';
import { useAuthStore } from '@/lib/store/authStore';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { EditProfileFormValues } from '@/components/profile/EditProfileForm';

// Mock dependencies
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@/lib/store/authStore');
jest.mock('react-hot-toast', () => ({
  error: jest.fn(),
  promise: jest.fn(),
}));

// Mock ProtectedRoute to simply render its children
jest.mock('@/components/Auth/ProtectedRoute', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// Mock EditProfileForm
const mockEditProfileFormSubmit = jest.fn();
jest.mock('@/components/profile/EditProfileForm', () => ({
  __esModule: true,
  default: jest.fn(({ onSubmit, initialData }) => (
    <form
      data-testid="edit-profile-form"
      onSubmit={(e) => {
        e.preventDefault();
        // Simulate form submission with some data
        onSubmit({
          displayName: initialData.displayName, // Default, can be changed in tests
          bio: initialData.bio,
          profilePictureUrl: initialData.profilePictureUrl,
          ...mockEditProfileFormSubmit(), // Allow tests to override submitted data
        });
      }}
    >
      <input
        type="text"
        defaultValue={initialData.displayName}
        data-testid="displayName-input"
      />
      <textarea defaultValue={initialData.bio} data-testid="bio-input" />
      <button type="submit">Submit</button>
    </form>
  )),
}));

describe('EditProfilePage', () => {
  let mockRouterPush: jest.Mock;
  let mockUpdateDisplayName: jest.Mock;

  beforeEach(() => {
    jest.useFakeTimers(); // Use Jest's fake timers

    mockRouterPush = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push: mockRouterPush });

    mockUpdateDisplayName = jest.fn();
    (useAuthStore as unknown as jest.Mock).mockReturnValue({
      isAuthenticated: true,
      isGuest: false,
      userEmail: 'test@example.com',
      isLoading: false,
      displayName: 'Test User',
      updateDisplayName: mockUpdateDisplayName,
    });

    (toast.promise as jest.Mock).mockImplementation((promise, { success }) => {
      return promise
        .then(() => {
          if (typeof success === 'function') success();
          return Promise.resolve();
        })
        .catch(() => Promise.resolve()); // Simplified for testing
    });
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers(); // Run any remaining timers
    jest.useRealTimers(); // Restore real timers
  });

  it('renders loading state', () => {
    (useAuthStore as unknown as jest.Mock).mockReturnValueOnce({
      isLoading: true,
      isAuthenticated: false,
      isGuest: false,
      userEmail: null,
      displayName: null,
      updateDisplayName: mockUpdateDisplayName,
    });
    render(<EditProfilePage />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders access restricted when not authenticated', () => {
    (useAuthStore as unknown as jest.Mock).mockReturnValueOnce({
      isLoading: false,
      isAuthenticated: false,
      isGuest: false,
      userEmail: null,
      displayName: null,
      updateDisplayName: mockUpdateDisplayName,
    });
    render(<EditProfilePage />);
    expect(screen.getByText('Access restricted.')).toBeInTheDocument();
  });

  it('renders access restricted when user is a guest', () => {
    (useAuthStore as unknown as jest.Mock).mockReturnValueOnce({
      isLoading: false,
      isAuthenticated: true,
      isGuest: true,
      userEmail: 'guest@example.com',
      displayName: 'Guest User',
      updateDisplayName: mockUpdateDisplayName,
    });
    render(<EditProfilePage />);
    expect(screen.getByText('Access restricted.')).toBeInTheDocument();
  });

  it('renders the edit profile form when authenticated and not a guest', () => {
    render(<EditProfilePage />);
    expect(screen.getByText('Edit Your Profile')).toBeInTheDocument();
    expect(screen.getByTestId('edit-profile-form')).toBeInTheDocument();
    expect(
      screen.getByText(
        /Changes to your profile will be visible to other users./ // Use regex for partial/flexible matching
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /Your email address \(test@example.com\) is private and will not be shown./
      )
    ).toBeInTheDocument();
  });

  it('populates form with initialData from authStore displayName', () => {
    (useAuthStore as unknown as jest.Mock).mockReturnValueOnce({
      isAuthenticated: true,
      isGuest: false,
      userEmail: 'test@example.com',
      isLoading: false,
      displayName: 'Stored Name',
      updateDisplayName: mockUpdateDisplayName,
    });
    render(<EditProfilePage />);
    expect(screen.getByTestId('displayName-input')).toHaveValue('Stored Name');
    expect(screen.getByTestId('bio-input')).toHaveValue(
      'This is my current Kasese Socials bio. I love connecting with people and sharing my thoughts!'
    );
  });

  it('populates form with initialData from userEmail when displayName is null', () => {
    (useAuthStore as unknown as jest.Mock).mockReturnValueOnce({
      isAuthenticated: true,
      isGuest: false,
      userEmail: 'emailonly@example.com',
      isLoading: false,
      displayName: null,
      updateDisplayName: mockUpdateDisplayName,
    });
    render(<EditProfilePage />);
    expect(screen.getByTestId('displayName-input')).toHaveValue('emailonly');
  });

  it('populates form with empty string for displayName if both displayName and userEmail are null/undefined', () => {
    (useAuthStore as unknown as jest.Mock).mockReturnValueOnce({
      isAuthenticated: true,
      isGuest: false,
      userEmail: null,
      isLoading: false,
      displayName: null,
      updateDisplayName: mockUpdateDisplayName,
    });
    render(<EditProfilePage />);
    expect(screen.getByTestId('displayName-input')).toHaveValue('');
  });

  describe('Form Submission', () => {
    it('handles successful submission with displayName change', async () => {
      const newDisplayName = 'New Display Name';
      mockEditProfileFormSubmit.mockReturnValue({
        displayName: newDisplayName,
      });

      render(<EditProfilePage />);
      fireEvent.submit(screen.getByTestId('edit-profile-form'));

      act(() => {
        jest.runAllTimers(); // Advance all timers
      });

      await waitFor(() => {
        expect(toast.promise).toHaveBeenCalled();
      });

      await waitFor(() => {
        expect(mockUpdateDisplayName).toHaveBeenCalledWith(newDisplayName);
      });
      await waitFor(() => {
        expect(mockRouterPush).toHaveBeenCalledWith('/profile');
      });
    });

    it('handles successful submission without displayName change', async () => {
      mockEditProfileFormSubmit.mockReturnValue({ displayName: 'Test User' });

      render(<EditProfilePage />);
      fireEvent.submit(screen.getByTestId('edit-profile-form'));

      act(() => {
        jest.runAllTimers(); // Advance all timers
      });

      await waitFor(() => {
        expect(toast.promise).toHaveBeenCalled();
      });

      await waitFor(() => {
        expect(mockUpdateDisplayName).not.toHaveBeenCalled();
      });
      await waitFor(() => {
        expect(mockRouterPush).toHaveBeenCalledWith('/profile');
      });
    });

    it('handles submission attempt when not authenticated', async () => {
      (useAuthStore as unknown as jest.Mock).mockReturnValueOnce({
        isLoading: false,
        isAuthenticated: false,
        isGuest: false,
        userEmail: null,
        displayName: null,
        updateDisplayName: mockUpdateDisplayName,
      });

      render(<EditProfilePage />);

      // No submission event possible if form is not rendered.
      expect(screen.getByText('Access restricted.')).toBeInTheDocument();
      expect(toast.error).not.toHaveBeenCalled();
      expect(mockRouterPush).not.toHaveBeenCalled();
      expect(mockUpdateDisplayName).not.toHaveBeenCalled();
    });

    it('handles submission attempt when user is guest', async () => {
      (useAuthStore as unknown as jest.Mock).mockReturnValueOnce({
        isLoading: false,
        isAuthenticated: true, // Authenticated but a guest
        isGuest: true,
        userEmail: 'guest@example.com',
        displayName: 'Guest User',
        updateDisplayName: mockUpdateDisplayName,
      });

      render(<EditProfilePage />);

      expect(screen.getByText('Access restricted.')).toBeInTheDocument();
      expect(toast.error).not.toHaveBeenCalled();
      expect(mockRouterPush).not.toHaveBeenCalled();
      expect(mockUpdateDisplayName).not.toHaveBeenCalled();
    });
  });
});

export const setMockEditProfileFormSubmitData = (data: EditProfileFormValues) => {
  mockEditProfileFormSubmit.mockReturnValue(data);
};
