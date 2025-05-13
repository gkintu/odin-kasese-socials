// src/components/layout/Navbar.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useAuthStore } from '@/lib/store/authStore'; // To mock its state
import Navbar from './Navbar';

// Mock the useAuthStore
jest.mock('@/lib/store/authStore');

// Mock Next.js Link component for testing navigation links
jest.mock('next/link', () => {
  // eslint-disable-next-line react/display-name
  return ({ children, href }: { children: React.ReactNode; href: string }) => (
    // Simulate Link behavior by returning an anchor tag with children and href
    <a href={href}>{children}</a>
  );
});

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    // Add any other router properties/methods your component uses
  }),
  usePathname: jest.fn(() => '/'), // Add mock for usePathname
}));

describe('Navbar', () => {
  // Cast the mock to the correct type
  const mockUseAuthStore = useAuthStore as jest.MockedFunction<
    typeof useAuthStore
  >;
  let mockLogout: jest.Mock;

  // Helper function to set mock store values
  const setMockAuthState = (
    state: Partial<ReturnType<typeof useAuthStore>>
  ) => {
    mockUseAuthStore.mockReturnValue({
      isAuthenticated: false,
      userEmail: null,
      displayName: null,
      isGuest: false,
      isLoading: false,
      logout: mockLogout,
      error: null,
      loginRequest: jest.fn(),
      loginSuccess: jest.fn(),
      loginFailure: jest.fn(),
      loginAsGuest: jest.fn(),
      updateDisplayName: jest.fn(), // Added missing mock for updateDisplayName
      ...state, // Spread the state to override defaults
    });
  };

  beforeEach(() => {
    mockLogout = jest.fn();
    // Default to logged-out state
    setMockAuthState({});
  });

  it('should render Login and Sign Up links when not authenticated and not a guest', () => {
    render(<Navbar />);
    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByText('Sign Up')).toBeInTheDocument();
    expect(
      screen.queryByText(/welcome, test@example.com/i)
    ).not.toBeInTheDocument();
    expect(screen.queryByText(/browse as guest/i)).not.toBeInTheDocument();
  });

  it('should render user email and Logout button when authenticated', () => {
    // Mock authenticated state
    (useAuthStore as unknown as jest.Mock).mockReturnValue({
      isAuthenticated: true,
      userEmail: 'test@example.com',
      isGuest: false,
      logout: mockLogout,
      displayName: null, // Explicitly null or undefined for this test case
    });
    render(<Navbar />);
    expect(screen.getByText(/Welcome, test!/i)).toBeInTheDocument(); // Changed expectation
    expect(screen.getByRole('button', { name: /logout/i })).toBeInTheDocument();
    expect(screen.queryByText('Login')).not.toBeInTheDocument();
    expect(screen.queryByText('Sign Up')).not.toBeInTheDocument();
  });

  it('should render displayName and Logout button when authenticated and displayName is available', () => {
    (useAuthStore as unknown as jest.Mock).mockReturnValue({
      isAuthenticated: true,
      userEmail: 'test@example.com',
      isGuest: false,
      logout: mockLogout,
      displayName: 'TestUser', // displayName is provided
    });
    render(<Navbar />);
    expect(screen.getByText(/Welcome, TestUser!/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /logout/i })).toBeInTheDocument();
  });

  it('should render guest info, Login/Sign Up links, and End Guest Session button when Browse as guest', () => {
    setMockAuthState({ isAuthenticated: false, isGuest: true }); // Set guest state
    render(<Navbar />);
    expect(screen.getByText(/browse as guest/i)).toBeInTheDocument();
    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByText('Sign Up')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /end guest session/i })
    ).toBeInTheDocument();
    expect(screen.queryByText(/welcome/i)).not.toBeInTheDocument();
  });

  it('should call logout from store when Logout button is clicked (authenticated user)', () => {
    setMockAuthState({
      isAuthenticated: true,
      userEmail: 'test@example.com',
      isGuest: false,
    });
    render(<Navbar />);
    fireEvent.click(screen.getByRole('button', { name: /logout/i }));
    expect(mockLogout).toHaveBeenCalledTimes(1);
  });

  it('should call logout from store when End Guest Session button is clicked', () => {
    setMockAuthState({ isAuthenticated: false, isGuest: true });
    render(<Navbar />);
    fireEvent.click(screen.getByRole('button', { name: /end guest session/i }));
    expect(mockLogout).toHaveBeenCalledTimes(1); // Same logout action
  });

  it('should render Profile and Dashboard links when authenticated', () => {
    setMockAuthState({
      isAuthenticated: true,
      userEmail: 'test@example.com',
      isGuest: false,
    });
    render(<Navbar />);
    // Check for Profile link specifically
    expect(screen.getByRole('link', { name: /^Profile$/i })).toBeInTheDocument();
    // Check for Dashboard link
    expect(
      screen.getByRole('link', { name: /dashboard/i })
    ).toBeInTheDocument();
  });

  it('should NOT render Profile or Dashboard links when not authenticated', () => {
    setMockAuthState({ isAuthenticated: false, isGuest: false });
    render(<Navbar />);
    // Ensure Profile link is not present
    expect(
      screen.queryByRole('link', { name: /profile/i })
    ).not.toBeInTheDocument();
    // Ensure Dashboard link is not present
    expect(
      screen.queryByRole('link', { name: /dashboard/i })
    ).not.toBeInTheDocument();
  });

  it('should NOT render Profile or Dashboard links when Browse as guest', () => {
    setMockAuthState({ isAuthenticated: false, isGuest: true });
    render(<Navbar />);
    // Ensure Profile link is not present
    expect(
      screen.queryByRole('link', { name: /profile/i })
    ).not.toBeInTheDocument();
    // Ensure Dashboard link is not present
    expect(
      screen.queryByRole('link', { name: /dashboard/i })
    ).not.toBeInTheDocument();
  });

  it('should render displayName if available, falling back to userEmail', () => {
    setMockAuthState({
      isAuthenticated: true,
      userEmail: 'test@example.com',
      displayName: 'TestUser',
      isGuest: false,
    });
    render(<Navbar />);
    expect(screen.getByText(/welcome, testuser/i)).toBeInTheDocument();
    expect(
      screen.queryByText(/welcome, test@example.com/i)
    ).not.toBeInTheDocument();
  });

  it('should handle async expectations correctly', async () => {
    setMockAuthState({
      isAuthenticated: true,
      userEmail: 'test@example.com',
      isGuest: false,
    });
    render(<Navbar />);
    await waitFor(() => {
      expect(
        screen.queryByText(/welcome, test@example.com/i)
      ).not.toBeInTheDocument();
    });
  });
});
