import { render, screen, act } from '@testing-library/react';
import ProtectedRoute from './ProtectedRoute';
import { useAuthStore } from '@/lib/store/authStore';
import { useRouter } from 'next/navigation';

jest.mock('@/lib/store/authStore');
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('ProtectedRoute', () => {
  const mockUseAuthStore = useAuthStore as jest.MockedFunction<
    typeof useAuthStore
  >;
  const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;
  let mockPush: jest.Mock;

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
    mockPush = jest.fn();
    mockUseRouter.mockReturnValue({ push: mockPush } as any); // Cast as any for simplicity if other router props aren't used
    // Reset to a default non-authed, non-guest, not loading state
    setMockAuthState({
      isAuthenticated: false,
      isGuest: false,
      isLoading: false,
    });
  });

  it('should render loading state when isLoading is true', () => {
    setMockAuthState({ isLoading: true });
    render(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    );
    expect(screen.getByText(/Loading application.../i)).toBeInTheDocument();
  });

  it('should render children when authenticated and not loading', () => {
    setMockAuthState({ isAuthenticated: true, isLoading: false });
    render(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    );
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
    expect(mockPush).not.toHaveBeenCalled();
  });

  it('should render children when user is a guest and not loading', () => {
    setMockAuthState({ isGuest: true, isLoading: false }); // Guest user
    render(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    );
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
    expect(mockPush).not.toHaveBeenCalled();
  });

  it('should redirect to /login when not authenticated, not a guest, and not loading', () => {
    // Default state from beforeEach is already not authenticated, not guest, not loading
    act(() => {
      render(
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      );
    });
    expect(mockPush).toHaveBeenCalledWith('/login');
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('should not redirect if authenticated, even if also marked as guest (which should not happen)', () => {
    // This state (isAuthenticated: true, isGuest: true) should ideally not occur if store logic is correct,
    // but testing how ProtectedRoute handles it based on (isAuthenticated || isGuest)
    setMockAuthState({
      isAuthenticated: true,
      isGuest: true,
      isLoading: false,
    });
    render(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    );
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
    expect(mockPush).not.toHaveBeenCalled();
  });
});
