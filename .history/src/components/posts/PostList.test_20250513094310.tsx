import React from 'react';
import { render, screen } from '@testing-library/react';
import PostList from './PostList';

const mockPosts = [
  { id: '1', title: 'Post 1', content: 'Content 1' },
  { id: '2', title: 'Post 2', content: 'Content 2' },
];

describe('PostList', () => {
  it('renders a list of posts', () => {
    render(<PostList posts={mockPosts} />);

    mockPosts.forEach((post) => {
      expect(screen.getByText(post.title)).toBeInTheDocument();
      expect(screen.getByText(post.content)).toBeInTheDocument();
    });
  });

  it('renders an empty list when no posts are provided', () => {
    render(<PostList posts={[]} />);
    expect(screen.queryByText(/Post/)).not.toBeInTheDocument();
  });
});
