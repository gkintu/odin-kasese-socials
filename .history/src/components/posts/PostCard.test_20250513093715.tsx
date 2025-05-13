import React from 'react';
import { render, screen } from '@testing-library/react';
import PostCard from './PostCard';
import { Post } from '../../types/post';

describe('PostCard', () => {
  it('renders post content correctly', () => {
    const mockPost: Post = {
      id: '1',
      author: { id: '1', name: 'John Doe', avatarUrl: 'https://example.com/avatar.png' },
      contentText: 'This is a test post',
      contentImageUrl: 'https://example.com/image.png',
      timestamp: new Date(),
      likes: 10,
      commentsCount: 5,
    };

    render(<PostCard post={mockPost} />);

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('This is a test post')).toBeInTheDocument();
    expect(screen.getByAltText('Post content')).toBeInTheDocument();
    expect(screen.getByText('10 Likes')).toBeInTheDocument();
    expect(screen.getByText('5 Comments')).toBeInTheDocument();
  });
});
