import { render, screen, fireEvent } from '@testing-library/react';
import CreatePostForm from './CreatePostForm';

describe('CreatePostForm', () => {
  it('renders the form correctly', () => {
    render(<CreatePostForm />);

    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/content/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create post/i })).toBeInTheDocument();
  });

  it('handles form submission', () => {
    render(<CreatePostForm />);

    const titleInput = screen.getByLabelText(/title/i);
    const contentInput = screen.getByLabelText(/content/i);
    const submitButton = screen.getByRole('button', { name: /create post/i });

    fireEvent.change(titleInput, { target: { value: 'Test Title' } });
    fireEvent.change(contentInput, { target: { value: 'Test Content' } });
    fireEvent.click(submitButton);

    expect(titleInput).toHaveValue('');
    expect(contentInput).toHaveValue('');
  });
});
// src/components/posts/CreatePostForm.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CreatePostForm, { CreatePostFormValues } from './CreatePostForm'; // Assuming type is exported

describe('CreatePostForm', () => {
  const mockSubmit = jest.fn();
  const mockCancel = jest.fn(); // Optional cancel handler

  beforeEach(() => {
    // Clear mock calls before each test
    mockSubmit.mockClear();
    mockCancel.mockClear();
  });

  // Test 1: Renders essential form fields
  it('should render content textarea, image placeholder, and submit button', () => {
    render(<CreatePostForm onSubmit={mockSubmit} isSubmitting={false} />);

    // Check for content textarea
    expect(screen.getByLabelText(/what's on your mind?/i)).toBeInTheDocument();
    // Check for image upload placeholder/button
    expect(screen.getByRole('button', { name: /add image/i })).toBeInTheDocument();
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
    render(<CreatePostForm onSubmit={mockSubmit} isSubmitting={false} onCancel={mockCancel} />); 
    
    const postButton = screen.getByRole('button', { name: /post/i });
    await user.click(postButton);

    // Expect an error message for contentText
    expect(await screen.findByText(/Post content cannot be empty/i)).toBeInTheDocument();
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
    expect(await screen.findByText(/Post content must be 500 characters or less/i)).toBeInTheDocument();
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
      expect(mockSubmit).toHaveBeenCalledWith({ contentText: testContent }, expect.anything());
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
    render(<CreatePostForm onSubmit={mockSubmit} isSubmitting={false} onCancel={mockCancel} />);
    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    await user.click(cancelButton);
    expect(mockCancel).toHaveBeenCalledTimes(1);
  });
});