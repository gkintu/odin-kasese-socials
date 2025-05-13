import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CreatePostPage from './page';
import { useAuthStore } from '@/lib/store/authStore';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

// Mock dependencies
jest.mock('@/lib/store/authStore');
jest.mock('next/navigation', () => ({ useRouter: jest.fn() }));
jest.mock('@/components/posts/CreatePostForm', () => {
  // eslint-disable-next-line react/display-name
  return jest.fn(({ onSubmit, isSubmitting, onCancel }) => (
    <form data-testid="mock-create-post-form" onSubmit={(e) => { e.preventDefault(); onSubmit({ contentText: 'Test submission' }); }}>
      <textarea aria-label="Mock Content"></textarea>
      <button type="submit" disabled={isSubmitting}>Mock Submit Post</button>
      {onCancel && <button type="button" onClick={onCancel}>Mock Cancel</button>}
    </form>
  ));
});
jest.mock('react-hot-toast', () => ({ success: jest.fn(), error: jest.fn(), loading: jest.fn(), dismiss: jest.fn() }));
jest.mock('@/components/Auth/ProtectedRoute', () => ({ children }: {children: React.ReactNode}) => <>{children}</>);

describe('CreatePostPage', () => {
  const mockUseAuthStore = useAuthStore as jest.MockedFunction<typeof useAuthStore>;
  const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;
  let mockPush: jest.Mock;
  const mockToastError = toast.error as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    mockPush = jest.fn();
    mockUseRouter.mockReturnValue({ push: mockPush } as any);
    // Default to authenticated, non-guest, not loading for most tests here
    mockUseAuthStore.mockReturnValue({
      isAuthenticated: true, isGuest: false, isLoading: false,
      userEmail: 'test@example.com', displayName: 'Test User',
      // Mock store methods as needed
      updateDisplayName: jest.fn(), loginRequest: jest.fn(), loginSuccess: jest.fn(),
      loginFailure: jest.fn(), loginAsGuest: jest.fn(), logout: jest.fn(), error: null,
    });
  });

  it('renders loading state initially if authIsLoading is true', () => {
    mockUseAuthStore.mockReturnValueOnce({ ...useAuthStore(), isLoading: true } as any);
    render(<CreatePostPage />);
    expect(screen.getByText(/Loading page.../i)).toBeInTheDocument();
  });

  it('redirects and shows error if not authenticated', async () => {
    mockUseAuthStore.mockReturnValueOnce({ ...useAuthStore(), isAuthenticated: false, isGuest: false, isLoading: false } as any);
    render(<CreatePostPage />);
    await waitFor(() => expect(mockToastError).toHaveBeenCalledWith('You must be logged in to create a post.'));
    await waitFor(() => expect(mockPush).toHaveBeenCalledWith('/login'));
  });

  it('redirects and shows error if user is a guest', async () => {
    mockUseAuthStore.mockReturnValueOnce({ ...useAuthStore(), isAuthenticated: false, isGuest: true, isLoading: false } as any);
    render(<CreatePostPage />);
    await waitFor(() => expect(mockToastError).toHaveBeenCalledWith('You must be logged in to create a post.'));
    await waitFor(() => expect(mockPush).toHaveBeenCalledWith('/login'));
  });

  it('renders CreatePostForm for authenticated non-guest user', () => {
    // State already set in beforeEach for authenticated user
    render(<CreatePostPage />);
    expect(screen.getByTestId('mock-create-post-form')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /New Post/i })).toBeInTheDocument();
  });

  // Add test for handleCreatePost submission logic if needed,
  // though much of it (toast calls, router.push) can be considered implementation details
  // if the onSubmit prop passed to the mocked form is complex.
  // For now, we assume the form's onSubmit is correctly wired from the page.
});
