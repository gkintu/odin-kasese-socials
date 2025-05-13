// src/components/layout/Navbar.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { useAuthStore } from '@/lib/store/authStore'; // To mock its state
import Navbar from './Navbar';
import Link from 'next/link'; // We will need to mock Next.js Link

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
      isGuest: false,
      logout: mockLogout,
      isLoading: false,
      error: null,
      loginRequest: jest.fn(),
      loginSuccess: jest.fn(),
      loginFailure: jest.fn(),
      loginAsGuest: jest.fn(), // Add new actions from store
      ...state, // Override with provided state
    });
  };

  beforeEach(() => {
    mockLogout = jest.fn();
    // Default to logged-out state
    setMockAuthState({});
  });

  it('should render Login and Sign Up links when not authenticated and not a guest', () => {
    render(<Navbar />);
    expect(screen.getByRole('link', { name: /login/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /sign up/i })).toBeInTheDocument();
    expect(screen.queryByText(/welcome/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/browse as guest/i)).not.toBeInTheDocument();
  });

  it('should render user email and Logout button when authenticated', () => {
    setMockAuthState({
      isAuthenticated: true,
      userEmail: 'test@example.com',
      isGuest: false,
    });
    render(<Navbar />);
    expect(screen.getByText(/welcome, test@example.com/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /logout/i })).toBeInTheDocument();
    expect(
      screen.queryByRole('link', { name: /login/i })
    ).not.toBeInTheDocument();
  });

  it('should render guest info, Login/Sign Up links, and End Guest Session button when Browse as guest', () => {
    setMockAuthState({ isAuthenticated: false, isGuest: true }); // Set guest state
    render(<Navbar />);
    expect(screen.getByText(/browse as guest/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /login/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /sign up/i })).toBeInTheDocument();
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
});
