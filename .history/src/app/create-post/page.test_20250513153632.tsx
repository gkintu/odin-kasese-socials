import { render, screen, waitFor } from '@testing-library/react';
import CreatePostPage from './page';
import { useAuthStore } from '@/lib/store/authStore';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

interface RouterMock {
  push: jest.Mock;
  back: jest.Mock;
  forward: jest.Mock;
  refresh: jest.Mock;
  replace: jest.Mock;
  prefetch: jest.Mock;
}

interface AuthStoreMock {
  isAuthenticated: boolean;
  isGuest: boolean;
  isLoading: boolean;
  userEmail: string;
  displayName: string;
  updateDisplayName: jest.Mock;
  loginRequest: jest.Mock;
  loginSuccess: jest.Mock;
  loginFailure: jest.Mock;
  loginAsGuest: jest.Mock;
  logout: jest.Mock;
  error: null | string;
}

// Mock dependencies
jest.mock('@/lib/store/authStore');
jest.mock('next/navigation', () => ({ useRouter: jest.fn() }));
jest.mock('@/components/posts/CreatePostForm', () => {
  const CreatePostFormMock = ({ onSubmit, isSubmitting, onCancel }: { 
    onSubmit: (data: { contentText: string }) => void;
    isSubmitting: boolean;
    onCancel?: () => void;
  }) => (
    <form
      data-testid="mock-create-post-form"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit({ contentText: 'Test submission' });
      }}
    >
      <textarea aria-label="Mock Content"></textarea>
      <button type="submit" disabled={isSubmitting}>
        Mock Submit Post
      </button>
      {onCancel && (
        <button type="button" onClick={onCancel}>
          Mock Cancel
        </button>
      )}
    </form>
  );
  CreatePostFormMock.displayName = 'CreatePostFormMock';
  return jest.fn(CreatePostFormMock);
});
jest.mock('react-hot-toast', () => ({
  success: jest.fn(),
  error: jest.fn(),
  loading: jest.fn(),
  dismiss: jest.fn(),
}));
jest.mock(
  '@/components/Auth/ProtectedRoute',
  () =>
    ({ children }: { children: React.ReactNode }) => <>{children}</>
);

describe('CreatePostPage', () => {
  const mockUseAuthStore = useAuthStore as jest.MockedFunction<typeof useAuthStore>;
  const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;
  let mockPush: jest.Mock;
  const mockToastError = toast.error as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    mockPush = jest.fn();
    mockUseRouter.mockReturnValue({
      push: mockPush,
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
    } as RouterMock);
    // Default to authenticated, non-guest, not loading for most tests here
    mockUseAuthStore.mockReturnValue({
      isAuthenticated: true,
      isGuest: false,
      isLoading: false,
      userEmail: 'test@example.com',
      displayName: 'Test User',
      updateDisplayName: jest.fn(),
      loginRequest: jest.fn(),
      loginSuccess: jest.fn(),
      loginFailure: jest.fn(),
      loginAsGuest: jest.fn(),
      logout: jest.fn(),
      error: null,
    } as AuthStoreMock);
  });

  it('renders loading state initially if authIsLoading is true', () => {
    mockUseAuthStore.mockReturnValueOnce({
      ...useAuthStore(),
      isLoading: true,
    } as AuthStoreMock);
    render(<CreatePostPage />);
    expect(screen.getByText(/Loading page.../i)).toBeInTheDocument();
  });

  it('redirects and shows error if not authenticated', async () => {
    mockUseAuthStore.mockReturnValueOnce({
      ...useAuthStore(),
      isAuthenticated: false,
      isGuest: false,
      isLoading: false,
    } as AuthStoreMock);
    render(<CreatePostPage />);
    await waitFor(() =>
      expect(mockToastError).toHaveBeenCalledWith(
        'You must be logged in to create a post.'
      )
    );
    await waitFor(() => expect(mockPush).toHaveBeenCalledWith('/login'));
  });

  it('redirects and shows error if user is a guest', async () => {
    mockUseAuthStore.mockReturnValueOnce({
      ...useAuthStore(),
      isAuthenticated: false,
      isGuest: true,
      isLoading: false,
    } as AuthStoreMock);
    render(<CreatePostPage />);
    await waitFor(() =>
      expect(mockToastError).toHaveBeenCalledWith(
        'You must be logged in to create a post.'
      )
    );
    await waitFor(() => expect(mockPush).toHaveBeenCalledWith('/login'));
  });

  it('renders CreatePostForm for authenticated non-guest user', () => {
    // State already set in beforeEach for authenticated user
    render(<CreatePostPage />);
    expect(screen.getByTestId('mock-create-post-form')).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /New Post/i })
    ).toBeInTheDocument();
  });
});
