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

  beforeEach(() => {
    // Reset mocks before each test
    mockLogout = jest.fn();
    // Default unauthenticated state for most tests
    mockUseAuthStore.mockReturnValue({
      isAuthenticated: false,
      userEmail: null,
      logout: mockLogout,
      isLoading: false, // Add isLoading to the mock return
      // Add other properties from AuthState as needed by Navbar or for completeness
      error: null,
      loginRequest: jest.fn(),
      loginSuccess: jest.fn(),
      loginFailure: jest.fn(),
    });
  });

  // Test case for rendering login and signup links when not authenticated
  it('should render Login and Sign Up links when not authenticated', () => {
    render(<Navbar />);
    // Expect "Login" link to be present
    expect(screen.getByRole('link', { name: /login/i })).toBeInTheDocument();
    // Expect "Sign Up" link to be present
    expect(screen.getByRole('link', { name: /sign up/i })).toBeInTheDocument();
    // Expect "Logout" button NOT to be present
    expect(
      screen.queryByRole('button', { name: /logout/i })
    ).not.toBeInTheDocument();
  });

  // Test case for rendering user email and logout button when authenticated
  it('should render user email and Logout button when authenticated', () => {
    // Override mock state for this specific test: authenticated
    mockUseAuthStore.mockReturnValue({
      isAuthenticated: true,
      userEmail: 'test@example.com',
      logout: mockLogout,
      isLoading: false,
      error: null,
      loginRequest: jest.fn(),
      loginSuccess: jest.fn(),
      loginFailure: jest.fn(),
    });

    render(<Navbar />);
    // Expect welcome message with user email to be present
    expect(screen.getByText(/welcome, test@example.com/i)).toBeInTheDocument();
    // Expect "Logout" button to be present
    expect(screen.getByRole('button', { name: /logout/i })).toBeInTheDocument();
    // Expect "Login" link NOT to be present
    expect(
      screen.queryByRole('link', { name: /login/i })
    ).not.toBeInTheDocument();
    // Expect "Sign Up" link NOT to be present
    expect(
      screen.queryByRole('link', { name: /sign up/i })
    ).not.toBeInTheDocument();
  });

  // Test case for calling logout from the store when Logout button is clicked
  it('should call logout from store when Logout button is clicked', () => {
    // Override mock state for this specific test: authenticated
    mockUseAuthStore.mockReturnValue({
      isAuthenticated: true,
      userEmail: 'test@example.com',
      logout: mockLogout, // Use the mockLogout defined in beforeEach
      isLoading: false,
      error: null,
      loginRequest: jest.fn(),
      loginSuccess: jest.fn(),
      loginFailure: jest.fn(),
    });

    render(<Navbar />);
    // Find the Logout button
    const logoutButton = screen.getByRole('button', { name: /logout/i });
    // Simulate a click on the Logout button
    fireEvent.click(logoutButton);
    // Expect the mockLogout function to have been called once
    expect(mockLogout).toHaveBeenCalledTimes(1);
  });
});
