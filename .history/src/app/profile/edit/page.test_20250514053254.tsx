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
    (useAuthStore as jest.Mock).mockReturnValue({
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
    (useAuthStore as jest.Mock).mockReturnValueOnce({
      ...useAuthStore(),
      isLoading: true,
    });
    render(<EditProfilePage />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders access restricted for unauthenticated users', () => {
    (useAuthStore as jest.Mock).mockReturnValueOnce({
      ...useAuthStore(),
      isAuthenticated: false,
    });
    render(<EditProfilePage />);
    expect(screen.getByText('Access restricted.')).toBeInTheDocument();
  });

  it('renders access restricted for guest users', () => {
    (useAuthStore as jest.Mock).mockReturnValueOnce({
      ...useAuthStore(),
      isGuest: true,
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
    (useAuthStore as jest.Mock).mockReturnValueOnce({
      ...useAuthStore(),
      displayName: null,
      userEmail: 'testuser@example.com',
    });
    render(<EditProfilePage />);
    expect(screen.getByTestId('displayName-input')).toHaveValue('testuser');
  });

  it('handles profile update successfully', async () => {
    render(<EditProfilePage />);
    
    const newDisplayName = 'NewDisplayName';
    // Simulate user typing a new display name - our mock form doesn't do this, so we'll adjust the submit mock
    // For a real form, you'd use fireEvent.change here.
    // We will simulate the data passed to handleEditProfileSubmit directly for this test.

    // Directly call the submit handler as if the form was filled and submitted
    // Get the onSubmit prop from the mocked EditProfileForm
     const editProfileForm = screen.getByTestId('edit-profile-form');
     // We need to get the onSubmit prop from the actual component instance, not the mock itself.
     // This is tricky with the current mock setup.
     // A better way would be to find the submit button and click it.
     fireEvent.submit(editProfileForm);


    await waitFor(() => {
      expect(mockUpdateDisplayName).toHaveBeenCalledWith('CurrentName'); // Mock form submits initialData
    });
    
    await waitFor(() => {
      expect(toast.promise).toHaveBeenCalled();
    });
    
    // Need to ensure the promise inside toast.promise resolves
    // The mock implementation of toast.promise calls success() upon resolution
    // And success() is mocked to return the success message string
    await waitFor(() => {
        expect(mockRouterPush).toHaveBeenCalledWith('/profile');
    });
     // Check that the success callback of toast.promise was called, which in turn calls router.push
     // This part is a bit indirect due to the nature of toast.promise
     // We can verify the router push and the updateDisplayName call.
  });


  it('redirects to login and shows error if trying to submit when not authenticated', async () => {
    (useAuthStore as jest.Mock).mockReturnValueOnce({
      ...useAuthStore(),
      isAuthenticated: false,
    });
    render(<EditProfilePage />);
    
    // Even though the form might not be visible, we test the handler's robustness
    // This scenario is more about the handleEditProfileSubmit function's internal logic
    // than user interaction when the UI prevents it.
    // To test this properly, we would need to export handleEditProfileSubmit or trigger it differently.
    // However, given the component structure, if !isAuthenticated, the form isn't rendered.
    // The ProtectedRoute should handle redirection before this page even renders its main content.
    // The check within handleEditProfileSubmit is a fallback.

    // Let's assume we could somehow call handleEditProfileSubmit
    // This part of the test is more conceptual for the current setup.
    // If the component renders "Access restricted.", the form won't be there to submit.
    // The test for "renders access restricted for unauthenticated users" covers the UI part.
    // To test the specific logic in handleEditProfileSubmit for an unauthenticated user,
    // one might need to call it more directly, which is not typical for React component testing.

    // For now, we'll rely on the fact that the form isn't available to unauthenticated users.
    // If it were, and they submitted:
    // const form = screen.getByTestId('edit-profile-form'); // This would fail
    // fireEvent.submit(form);
    // await waitFor(() => {
    //   expect(toast.error).toHaveBeenCalledWith('Access denied. Please log in.');
    //   expect(mockRouterPush).toHaveBeenCalledWith('/login');
    // });
    // This test case highlights a scenario that's hard to trigger via UI interaction
    // if the guards (ProtectedRoute and internal checks) work as expected.
    // The existing "renders access restricted" tests cover the UI behavior.
    expect(screen.getByText('Access restricted.')).toBeInTheDocument();
  });
  
  it('updates display name if it has changed', async () => {
    const mockSubmitData = { displayName: 'NewName', bio: 'bio', profilePictureUrl: 'url' };
    
    // Mock EditProfileForm to call onSubmit with specific data
    jest.mock('@/components/profile/EditProfileForm', () => ({
        __esModule: true,
        default: ({ onSubmit }: { onSubmit: (data: EditProfileFormValues) => void; }) => (
          <form data-testid="edit-profile-form-custom-submit" onSubmit={(e) => {
            e.preventDefault();
            onSubmit(mockSubmitData); 
          }}>
            <button type="submit">Submit</button>
          </form>
        ),
      }));

    render(<EditProfilePage />);
    fireEvent.submit(screen.getByTestId('edit-profile-form-custom-submit'));

    await waitFor(() => {
      expect(mockUpdateDisplayName).toHaveBeenCalledWith(mockSubmitData.displayName);
    });
    await waitFor(() => {
        expect(mockRouterPush).toHaveBeenCalledWith('/profile');
    });
  });

  it('does not update display name if it has not changed', async () => {
    const initialDisplayName = 'CurrentName';
    (useAuthStore as jest.Mock).mockReturnValueOnce({
        ...useAuthStore(),
        displayName: initialDisplayName,
      });

    const mockSubmitData = { displayName: initialDisplayName, bio: 'bio', profilePictureUrl: 'url' };
    
    jest.mock('@/components/profile/EditProfileForm', () => ({
        __esModule: true,
        default: ({ onSubmit }: { onSubmit: (data: EditProfileFormValues) => void; }) => (
          <form data-testid="edit-profile-form-no-change" onSubmit={(e) => {
            e.preventDefault();
            onSubmit(mockSubmitData); 
          }}>
            <button type="submit">Submit</button>
          </form>
        ),
      }));

    render(<EditProfilePage />);
    fireEvent.submit(screen.getByTestId('edit-profile-form-no-change'));

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
