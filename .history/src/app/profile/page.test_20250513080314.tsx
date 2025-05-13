import { render, screen } from '@testing-library/react';
import ProfilePage from './page'; // The page component itself
import { useAuthStore } from '@/lib/store/authStore';
// ProtectedRoute is imported but not used directly in the tests,
// its presence is verified by checking for its mock's data-testid.
// import ProtectedRoute from '@/components/Auth/ProtectedRoute'; // To verify it's used

// Mock dependencies
jest.mock('@/lib/store/authStore');
jest.mock('@/components/profile/UserProfileDisplay', () => {
  // eslint-disable-next-line react/display-name
  return ({
    displayName,
    userEmail,
  }: {
    displayName?: string;
    userEmail?: string;
  }) => (
    <div data-testid="mock-user-profile-display">
      UserProfile: {displayName || userEmail}
    </div>
  );
});
// ProtectedRoute is more complex to mock perfectly to test its *effect* here.
// We tested ProtectedRoute in isolation. Here, we mainly test ProfilePage's logic *within* it.
// We can provide a pass-through mock or test conditions based on authStore state.
jest.mock('@/components/Auth/ProtectedRoute', () => {
  // eslint-disable-next-line react/display-name
  return ({ children }: { children: React.ReactNode }) => (
    <div data-testid="mock-protected-route">{children}</div>
  );
});

describe('ProfilePage', () => {
  const mockUseAuthStore = useAuthStore as jest.MockedFunction<
    typeof useAuthStore
  >;

  // Define the full initial state for clarity, including functions
  const initialAuthStoreState = {
    isAuthenticated: false,
    userEmail: null,
    isGuest: false,
    isLoading: false,
    logout: jest.fn(),
    error: null,
    loginRequest: jest.fn(),
    loginSuccess: jest.fn(),
    loginFailure: jest.fn(),
    loginAsGuest: jest.fn(),
  };

  beforeEach(() => {
    // Clear mock call history for functions within the store state
    initialAuthStoreState.logout.mockClear();
    initialAuthStoreState.loginRequest.mockClear();
    initialAuthStoreState.loginSuccess.mockClear();
    initialAuthStoreState.loginFailure.mockClear();
    initialAuthStoreState.loginAsGuest.mockClear();
    // It's crucial to reset the mock hook's return value if not done per test
    // However, we will explicitly set it in each test below.
  });

  it('should render loading message when isLoading is true', () => {
    mockUseAuthStore.mockReturnValue({
      ...initialAuthStoreState,
      isLoading: true,
    });
    render(<ProfilePage />);
    expect(screen.getByText(/Loading profile.../i)).toBeInTheDocument();
    expect(
      screen.queryByTestId('mock-user-profile-display')
    ).not.toBeInTheDocument();
  });

  it('should render guest message when user is a guest', () => {
    mockUseAuthStore.mockReturnValue({
      ...initialAuthStoreState,
      isGuest: true,
    });
    render(<ProfilePage />);
    expect(screen.getByText(/Guest Access/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /login/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /sign up/i })).toBeInTheDocument();
    expect(
      screen.queryByTestId('mock-user-profile-display')
    ).not.toBeInTheDocument();
  });

  it('should render UserProfileDisplay when user is authenticated', () => {
    const testEmail = 'user@example.com';
    mockUseAuthStore.mockReturnValue({
      ...initialAuthStoreState,
      isAuthenticated: true,
      userEmail: testEmail,
    });
    render(<ProfilePage />);
    const profileDisplay = screen.getByTestId('mock-user-profile-display');
    expect(profileDisplay).toBeInTheDocument();
    expect(profileDisplay).toHaveTextContent(
      `UserProfile: ${testEmail.split('@')[0]}`
    );
  });

  it('should render login prompt if not authenticated, not guest, and not loading', () => {
    mockUseAuthStore.mockReturnValue({
      ...initialAuthStoreState, // Defaults are: isAuthenticated: false, isGuest: false, isLoading: false
    });
    render(<ProfilePage />);
    expect(
      screen.getByText(/You need to be logged in to view this page./i)
    ).toBeInTheDocument();
    expect(
      screen.queryByTestId('mock-user-profile-display')
    ).not.toBeInTheDocument();
  });

  it('should be wrapped by ProtectedRoute conceptually', () => {
    mockUseAuthStore.mockReturnValue(initialAuthStoreState); // Provide a default consistent state
    render(<ProfilePage />);
    expect(screen.getByTestId('mock-protected-route')).toBeInTheDocument();
  });
});
