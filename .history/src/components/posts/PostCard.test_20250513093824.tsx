// src/components/posts/PostCard.test.tsx
import { render, screen } from '@testing-library/react';
import PostCard from './PostCard';
import { Post } from '@/types/post'; // Import our Post type
import { formatDistanceToNow } from 'date-fns'; // We'll use this for timestamp display

// Mock date-fns to ensure consistent output for snapshots/tests if needed,
// or rely on its deterministic output for relative times based on a fixed date.
// For this example, we'll allow formatDistanceToNow to run as is.

// Sample dummy post data for testing
const dummyPost: Post = {
  id: '1',
  author: {
    id: 'u1',
    name: 'Jane Doe',
    avatarUrl: '/img/avatars/jane.png', // Ensure dummy images exist in public/img/avatars
  },
  contentText: 'Just enjoyed a wonderful hike in the Kasese hills! #Nature #Adventure',
  contentImageUrl: '/img/posts/hike.jpg', // Ensure dummy images exist in public/img/posts
  timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
  likes: 15,
  commentsCount: 3,
};

const dummyPostWithoutImage: Post = {
    ...dummyPost,
    id: '2',
    contentImageUrl: undefined,
};

describe('PostCard', () => {
  // Test case: renders all essential elements of a post with an image
  it('should render author info, content text, image, timestamp, and engagement stats', () => {
    render(<PostCard post={dummyPost} />);

    // Check author avatar (by alt text including author's name)
    expect(screen.getByAltText(`${dummyPost.author.name}'s avatar`)).toBeInTheDocument();
    // Check author name
    expect(screen.getByText(dummyPost.author.name)).toBeInTheDocument();
    // Check timestamp (relative format)
    // formatDistanceToNow will produce "about 2 hours ago" or similar
    expect(screen.getByText(formatDistanceToNow(dummyPost.timestamp, { addSuffix: true }))).toBeInTheDocument();

    // Check content text
    expect(screen.getByText(dummyPost.contentText)).toBeInTheDocument();
    // Check content image (by alt text or presence)
    expect(screen.getByAltText('Post image')).toBeInTheDocument();

    // Check engagement stats (text may vary based on pluralization)
    expect(screen.getByText(/15 likes/i)).toBeInTheDocument(); // Using regex for flexibility
    expect(screen.getByText(/3 comments/i)).toBeInTheDocument();

    // Check for Like and Comment buttons (by role and accessible name)
    expect(screen.getByRole('button', { name: /like post/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /comment on post/i })).toBeInTheDocument();
  });

  // Test case: renders correctly without a content image
  it('should render correctly without a content image', () => {
    render(<PostCard post={dummyPostWithoutImage} />);
    // Ensure no image with "Post image" alt text is rendered
    expect(screen.queryByAltText('Post image')).not.toBeInTheDocument();
    // Other elements should still be present
    expect(screen.getByText(dummyPostWithoutImage.author.name)).toBeInTheDocument();
    expect(screen.getByText(dummyPostWithoutImage.contentText)).toBeInTheDocument();
  });
});