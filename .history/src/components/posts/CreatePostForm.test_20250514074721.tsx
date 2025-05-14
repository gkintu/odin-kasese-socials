// src/components/posts/CreatePostForm.test.tsx
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CreatePostForm from './CreatePostForm';
import toast from 'react-hot-toast';

jest.mock('react-hot-toast', () => ({
  success: jest.fn(),
  error: jest.fn(),
}));

const mockCreateObjectURL = jest.fn(() => 'blob:mocked-url-123');
const mockRevokeObjectURL = jest.fn();

global.URL.createObjectURL = mockCreateObjectURL;
global.URL.revokeObjectURL = mockRevokeObjectURL;

describe('CreatePostForm', () => {
  const mockSubmit = jest.fn();
  const mockCancel = jest.fn(); // Optional cancel handler

  beforeEach(() => {
    jest.clearAllMocks(); // Clear all mocks including toast.error
  });

  // Test 1: Renders essential form fields
  it('should render content textarea, image placeholder, and submit button', () => {
    render(<CreatePostForm onSubmit={mockSubmit} isSubmitting={false} />);

    // Check for content textarea
    expect(screen.getByLabelText(/what's on your mind?/i)).toBeInTheDocument();
    // Check for image upload placeholder/button
    expect(
      screen.getByRole('button', { name: /add image/i })
    ).toBeInTheDocument();
    // Check for submit button
    expect(screen.getByRole('button', { name: /post/i })).toBeInTheDocument();
  });

  // Test 2: Allows typing in contentText textarea
  it('should allow typing in contentText textarea', async () => {
    const user = userEvent.setup();
    render(<CreatePostForm onSubmit={mockSubmit} isSubmitting={false} />);
    const contentTextarea = screen.getByLabelText(/what's on your mind?/i);

    await user.type(contentTextarea, 'This is a new post!');
    expect(contentTextarea).toHaveValue('This is a new post!');
  });

  // Test 3: Validation - contentText is required
  it('should show error if contentText is empty on submit', async () => {
    const user = userEvent.setup();
    // Pass onCancel for this test to ensure its presence doesn't break things
    render(
      <CreatePostForm
        onSubmit={mockSubmit}
        isSubmitting={false}
        onCancel={mockCancel}
      />
    );

    const postButton = screen.getByRole('button', { name: /post/i });
    await user.click(postButton);

    // Expect an error message for contentText
    expect(
      await screen.findByText(/Post content cannot be empty/i)
    ).toBeInTheDocument();
    expect(mockSubmit).not.toHaveBeenCalled();
  });

  // Test 4: Validation - contentText max length (e.g., 500 chars)
  it('should show error if contentText exceeds max length on submit', async () => {
    const user = userEvent.setup();
    const longText = 'a'.repeat(501); // Assuming max length is 500
    render(<CreatePostForm onSubmit={mockSubmit} isSubmitting={false} />);

    const contentTextarea = screen.getByLabelText(/what's on your mind?/i);
    await user.type(contentTextarea, longText); // Type into the textarea

    const postButton = screen.getByRole('button', { name: /post/i });
    await user.click(postButton); // Attempt to submit

    // Expect an error message for contentText length
    expect(
      await screen.findByText(/Post content must be 500 characters or less/i)
    ).toBeInTheDocument();
    expect(mockSubmit).not.toHaveBeenCalled();
  });

  // Test 5: Calls onSubmit with form data when valid
  it('should call onSubmit with contentText on valid submission', async () => {
    const user = userEvent.setup();
    render(<CreatePostForm onSubmit={mockSubmit} isSubmitting={false} />);
    const contentTextarea = screen.getByLabelText(/what's on your mind?/i);
    const postButton = screen.getByRole('button', { name: /post/i });

    const testContent = 'My awesome new post!';
    await user.type(contentTextarea, testContent);
    await user.click(postButton);

    // Wait for submit to be called
    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledTimes(1);
      expect(mockSubmit).toHaveBeenCalledWith({ contentText: testContent });
    });
  });

  // Test 6: Disables submit button when isSubmitting is true
  it('should disable submit button when isSubmitting is true', () => {
    render(<CreatePostForm onSubmit={mockSubmit} isSubmitting={true} />); // Pass isSubmitting as true
    const postButton = screen.getByRole('button', { name: /posting.../i }); // Text changes when submitting
    expect(postButton).toBeDisabled();
  });

  // Test 7: Optional: Calls onCancel when cancel button is clicked
  it('should call onCancel when cancel button is clicked if provided', async () => {
    const user = userEvent.setup();
    render(
      <CreatePostForm
        onSubmit={mockSubmit}
        isSubmitting={false}
        onCancel={mockCancel}
      />
    );
    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    await user.click(cancelButton);
    expect(mockCancel).toHaveBeenCalledTimes(1);
  });

  // Test 8: Allows selecting an image file and shows a preview
  it('should allow selecting an image file and show a preview', async () => {
    render(<CreatePostForm onSubmit={mockSubmit} isSubmitting={false} />);

    const fileInput = screen.getByLabelText(/upload image for post/i) as HTMLInputElement;

    const dummyFile = new File(['(⌐□_□)'], 'test-image.png', {
      type: 'image/png',
    });

    Object.defineProperty(fileInput, 'files', {
      value: [dummyFile],
    });
    fireEvent.change(fileInput);

    await waitFor(() => {
      expect(mockCreateObjectURL).toHaveBeenCalledWith(dummyFile);
    });

    const previewImage = screen.getByAltText('Selected preview') as HTMLImageElement;
    expect(previewImage.src).toBe('blob:mocked-url-123');

    expect(toast.error).not.toHaveBeenCalled();
  });

  // Test 9: Shows an error toast for invalid file type
  it('should show an error toast for invalid file type', async () => {
    render(<CreatePostForm onSubmit={mockSubmit} isSubmitting={false} />);
    const fileInput = screen.getByLabelText(/upload image for post/i) as HTMLInputElement;
    const invalidFile = new File(['content'], 'document.pdf', {
      type: 'application/pdf',
    });

    Object.defineProperty(fileInput, 'files', { value: [invalidFile] });
    fireEvent.change(fileInput);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Invalid file type. Please select an image.');
    });
    expect(mockCreateObjectURL).not.toHaveBeenCalled();
  });

  // Test 10: Revokes object URL on unmount if a blob URL was created
  it('should revoke object URL on unmount if a blob URL was created', () => {
    const { unmount } = render(<CreatePostForm onSubmit={mockSubmit} isSubmitting={false} />);
    const fileInput = screen.getByLabelText(/upload image for post/i) as HTMLInputElement;
    const dummyFile = new File(['(⌐□_□)'], 'test-image.png', {
      type: 'image/png',
    });

    Object.defineProperty(fileInput, 'files', { value: [dummyFile] });
    fireEvent.change(fileInput);

    expect(mockCreateObjectURL).toHaveBeenCalledTimes(1);

    unmount();

    expect(mockRevokeObjectURL).toHaveBeenCalledWith('blob:mocked-url-123');
  });
});
