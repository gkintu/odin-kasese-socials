// src/app/profile/edit/page.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import EditProfilePage from './page';
import { useAuthStore } from '@/lib/store/authStore';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

// Mock dependencies
jest.mock('@/lib/store/authStore');
jest.mock('next/navigation', () => ({ useRouter: jest.fn() }));
jest.mock('@/components/profile/EditProfileForm', () => {
  // eslint-disable-next-line react/display-name
  return jest.fn(({ onSubmit, initialData }) => (
    <form data-testid="mock-edit-profile-form" onSubmit={(e) => { e.preventDefault(); onSubmit(initialData); }}>
      <input defaultValue={initialData.displayName} aria-label="Display Name" />
      <button type="submit">Mock Save</button>
    </form>
  ));
});
jest.mock('react-hot-toast', () => ({ success: jest.fn(), error: jest.fn(), loading: jest.fn(), dismiss: jest.fn() }));
jest.mock('@/components/Auth/ProtectedRoute', () => ({ children }: {children: React.ReactNode}) => <>{children}</>);


describe('EditProfilePage', () => {
  const mockUseAuthStore = useAuthStore as jest.MockedFunction<typeof useAuthStore>;
  const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;
  let mockPush: jest.Mock;
  let mockUpdateDisplayName: jest.Mock;
  const mockToastError = toast.error as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    mockPush = jest.fn();
    mockUpdateDisplayName = jest.fn();
    mockUseRouter.mockReturnValue({ push: mockPush } as any);
    // Default: authenticated, non-guest, not loading
    mockUseAuthStore.mockReturnValue({
      isAuthenticated: true, isGuest: false, isLoading: false,
      userEmail: 'test@example.com', displayName: 'Test User', updateDisplayName: mockUpdateDisplayName,
      // other store methods mocked as needed
      loginRequest: jest.fn(), loginSuccess: jest.fn(), loginFailure: jest.fn(),
      loginAsGuest: jest.fn(), logout: jest.fn(), error: null,
    });
  });

  it('renders loading state initially if isLoading is true', () => {
    mockUseAuthStore.mockReturnValueOnce({
      isAuthenticated: true,
      isGuest: false,
      isLoading: true,
      userEmail: 'test@example.com',
      displayName: 'Test User',
      updateDisplayName: mockUpdateDisplayName,
      loginRequest: jest.fn(),
      loginSuccess: jest.fn(),
      loginFailure: jest.fn(),
      loginAsGuest: jest.fn(),
      logout: jest.fn(),
      error: null,
    });
    render(<EditProfilePage />);
    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
  });

  it('redirects and shows error if not authenticated', async () => {
    mockUseAuthStore.mockReturnValueOnce({ ...useAuthStore(), isAuthenticated: false, isGuest: false, isLoading: false } as any);
    render(<EditProfilePage />);
    await waitFor(() => expect(mockToastError).toHaveBeenCalledWith('Access denied. Please log in.'));
    await waitFor(() => expect(mockPush).toHaveBeenCalledWith('/login'));
  });

  it('redirects and shows error if user is a guest', async () => {
    mockUseAuthStore.mockReturnValueOnce({ ...useAuthStore(), isAuthenticated: false, isGuest: true, isLoading: false } as any);
    render(<EditProfilePage />);
    await waitFor(() => expect(mockToastError).toHaveBeenCalledWith('Access denied. Please log in.'));
    await waitFor(() => expect(mockPush).toHaveBeenCalledWith('/login'));
  });

  it('renders EditProfileForm for authenticated non-guest user with initial data', () => {
    // State already set in beforeEach for authenticated user
    render(<EditProfilePage />);
    expect(screen.getByTestId('mock-edit-profile-form')).toBeInTheDocument();
    // Check if the initial displayName (from store) would be passed to the form via initialData prop
    // Our mock form doesn't directly show it, but we tested the prop passing to EditProfileForm itself.
    // Here, we're confirming the page *would* render the form.
    expect(screen.getByLabelText('Display Name')).toHaveValue('Test User'); // Mocked form has an input
  });

  // More detailed test for the submission handler within the page
  it('handleEditProfileSubmit updates display name and redirects', async () => {
    const user = userEvent.setup();
    render(<EditProfilePage />);
    
    // Simulate form submission by the mocked form
    // This requires the mock form's submit button to be clickable and to call the onSubmit prop.
    const mockSaveButton = screen.getByRole('button', {name: /mock save/i});
    // Our mock form's onSubmit calls the page's handleEditProfileSubmit with initialData.
    // To test update, we'd need a more complex mock or interact with form elements if not mocked.
    // For simplicity, let's assume the handler is called. We can directly call it if needed for testing its internal logic
    // Or, we can assume the mock form passes *new* data.
    // Let's assume the mock form calls onSubmit with some data, e.g., the initialData.
    // If initialData.displayName is different from current store displayName, updateDisplayName should be called.
    
    // For this test, let's make the store's displayName different from what the form would submit
    mockUseAuthStore.mockReturnValue({
      isAuthenticated: true,
      isGuest: false,
      isLoading: false,
      userEmail: 'test@example.com',
      displayName: 'Old Name Store',
      updateDisplayName: mockUpdateDisplayName,
      loginRequest: jest.fn(),
      loginSuccess: jest.fn(),
      loginFailure: jest.fn(),
      loginAsGuest: jest.fn(),
      logout: jest.fn(),
      error: null,
    });
    
    // Re-render with the new store state if necessary, or rely on the mocked form's initialData
    // The EditProfileForm will be instantiated with initialData which might include 'Test User' (from previous mock setup)
    // or 'Old Name Store' if the page logic for initialData is dynamic to the store.
    // The key is that handleEditProfileSubmit will be called with data from the form.
    // Our mock form calls onSubmit(initialData), initialData in this test context will be what
    // EditProfilePage sets up based on the store.

    // Let's ensure EditProfileForm is mocked to allow filling it
    mockUseAuthStore.mockReturnValue({
      isAuthenticated: true,
      isGuest: false,
      isLoading: false,
      userEmail: 'test@example.com',
      displayName: 'Old Name Store',
      updateDisplayName: mockUpdateDisplayName,
      loginRequest: jest.fn(),
      loginSuccess: jest.fn(),
      loginFailure: jest.fn(),
      loginAsGuest: jest.fn(),
      logout: jest.fn(),
      error: null,
    });
    
    // Re-mock the form component without resetting modules
    const EditProfileForm = jest.requireActual('@/components/profile/EditProfileForm').default;
    jest.spyOn(EditProfileForm, 'default').mockImplementation(({ onSubmit, initialData: formInitialData }) => (
      <form data-testid="interactive-mock-edit-profile-form" onSubmit={(e) => { 
          e.preventDefault(); 
          onSubmit({ displayName: (e.target as any).displayNameInput.value, bio: (e.target as any).bioInput.value }); 
      }}>
        <input name="displayNameInput" defaultValue={formInitialData.displayName} aria-label="Display Name" />
        <textarea name="bioInput" defaultValue={formInitialData.bio} aria-label="Bio" />
        <button type="submit">Mock Save Interactive</button>
      </form>
    ));


    render(<EditProfilePageWithInteractiveForm />);
    const displayNameInput = screen.getByLabelText('Display Name');
    await user.clear(displayNameInput);
    await user.type(displayNameInput, 'New Submitted Name'); // Form has 'New Submitted Name'

    await user.click(screen.getByRole('button', {name: /mock save interactive/i}));
    
    await waitFor(() => {
      expect(mockUpdateDisplayName).toHaveBeenCalledWith('New Submitted Name');
    });
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('Profile updated successfully! (Dummy)');
    });
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/profile');
    });
  });
});