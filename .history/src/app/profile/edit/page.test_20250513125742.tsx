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
    mockUseAuthStore.mockReturnValueOnce({ ...useAuthStore(), isLoading: true } as any);
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
    // mockUpdateDisplayName is already defined in beforeEach and captured.
    
    // For this test, the store's displayName should be 'Old Name Store' initially.
    // The form will then submit 'New Submitted Name'.

    jest.resetModules(); // Reset modules to re-evaluate mocks if needed

    // Re-configure the mock for useAuthStore AFTER resetModules and BEFORE requiring the page.
    // This ensures that when './page' is required, it gets this specific mock.
    const mockUpdateDisplayNameFn = jest.fn(); // Use a fresh mock for this specific test instance if needed, or ensure beforeEach mock is correctly scoped
    mockUseAuthStore.mockReturnValue({
      isAuthenticated: true,
      isGuest: false,
      isLoading: false,
      userEmail: 'test@example.com',
      displayName: 'Old Name Store', // Store has 'Old Name Store'
      updateDisplayName: mockUpdateDisplayNameFn, // Ensure this is the mock we intend to check
      // Include other default store properties/methods as in beforeEach to ensure component stability
      loginRequest: jest.fn(),
      loginSuccess: jest.fn(),
      loginFailure: jest.fn(),
      loginAsGuest: jest.fn(),
      logout: jest.fn(),
      error: null,
    });
    
    jest.doMock('@/components/profile/EditProfileForm', () => {
      // eslint-disable-next-line react/display-name
      return jest.fn(({ onSubmit, initialData: formInitialData }) => (
        <form data-testid="interactive-mock-edit-profile-form" onSubmit={(e) => { 
            e.preventDefault(); 
            const form = e.target as HTMLFormElement;
            const displayNameValue = (form.elements.namedItem('displayNameInput') as HTMLInputElement)?.value;
            const bioValue = (form.elements.namedItem('bioInput') as HTMLTextAreaElement)?.value;
            onSubmit({ displayName: displayNameValue, bio: bioValue }); 
        }}>
          {/* Ensure initialData is correctly passed and used */}
          <input name="displayNameInput" defaultValue={formInitialData.displayName} aria-label="Display Name" />
          <textarea name="bioInput" defaultValue={formInitialData.bio || ''} aria-label="Bio" />
          <button type="submit">Mock Save Interactive</button>
        </form>
      ));
    });

    // Re-import with new mock for EditProfileForm and the re-established useAuthStore mock
    const EditProfilePageWithInteractiveForm = require('./page').default; 

    render(<EditProfilePageWithInteractiveForm />);
    const displayNameInput = screen.getByLabelText('Display Name');
    // Verify the form is initialized with the store's displayName from the re-established mock
    expect(displayNameInput).toHaveValue('Old Name Store');

    await user.clear(displayNameInput);
    await user.type(displayNameInput, 'New Submitted Name'); // Form has 'New Submitted Name'

    await user.click(screen.getByRole('button', {name: /mock save interactive/i}));
    
    await waitFor(() => {
      // Check the mock function that was provided to the store in this test scope
      expect(mockUpdateDisplayNameFn).toHaveBeenCalledWith('New Submitted Name');
    });
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('Profile updated successfully! (Dummy)');
    });
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/profile');
    });
  });
});