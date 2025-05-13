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
