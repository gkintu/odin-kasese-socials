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
  return ({ displayName }: { displayName?: string }) => (
    <div data-testid="mock-user-profile-display">
      UserProfile: {displayName}
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

  // Helper to set mock auth state
  const setMockAuthState = (
    state: Partial<ReturnType<typeof useAuthStore>>
  ) => {
    mockUseAuthStore.mockReturnValue({
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
      ...state,
    });
  };

  beforeEach(() => {
    // Default to a non-loading, non-authed, non-guest state for tests
    setMockAuthState({
      isLoading: false,
      isAuthenticated: false,
      isGuest: false,
    });
  });

  it('should render loading message when isLoading is true', () => {
    setMockAuthState({ isLoading: true });
    render(<ProfilePage />);
    // The loading message is from PageContent within ProfilePage
    expect(screen.getByText(/Loading profile.../i)).toBeInTheDocument();
  });

  it('should render guest message when user is a guest', () => {
    setMockAuthState({ isGuest: true, isLoading: false });
    render(<ProfilePage />);
    expect(screen.getByText(/Guest Access/i)).toBeInTheDocument();
    // Check for the "Login" link
    expect(screen.getByRole('link', { name: /login/i })).toBeInTheDocument();
    // Check for the "Sign Up" link
    expect(screen.getByRole('link', { name: /sign up/i })).toBeInTheDocument();
    // Ensure the main profile display is not there
    expect(
      screen.queryByTestId('mock-user-profile-display')
    ).not.toBeInTheDocument();
  });

  it('should render UserProfileDisplay when user is authenticated', () => {
    const testEmail = 'user@example.com';
    setMockAuthState({
      isAuthenticated: true,
      userEmail: testEmail,
      isLoading: false,
    });
    render(<ProfilePage />);
    // Check if our mocked UserProfileDisplay is rendered
    const profileDisplay = screen.getByTestId('mock-user-profile-display');
    expect(profileDisplay).toBeInTheDocument();
    // Check if it receives a displayName derived from email (as per current page logic)
    expect(profileDisplay).toHaveTextContent(
      `UserProfile: ${testEmail.split('@')[0]}`
    );
  });

  it('should render login prompt if not authenticated, not guest, and not loading (fallback within page)', () => {
    // This state should normally be caught by ProtectedRoute and redirected.
    // This tests the PageContent fallback.
    setMockAuthState({
      isAuthenticated: false,
      isGuest: false,
      isLoading: false,
    });
    render(<ProfilePage />);
    expect(
      screen.getByText(/You need to be logged in to view this page./i)
    ).toBeInTheDocument();
  });

  it('should be wrapped by ProtectedRoute conceptually', () => {
    // This test verifies that our mock of ProtectedRoute is in the rendered output,
    // implying the structure where ProfilePage's content is a child of ProtectedRoute.
    render(<ProfilePage />);
    expect(screen.getByTestId('mock-protected-route')).toBeInTheDocument();
  });
});
