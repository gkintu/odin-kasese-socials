// src/components/posts/PostList.test.tsx
import { render, screen } from '@testing-library/react';
import PostList from './PostList';
import { Post } from '@/types/post'; // Import Post type

// Mock the PostCard component to simplify PostList testing
// We only want to test if PostList renders the correct number of PostCards,
// not the internals of PostCard itself (that's done in PostCard.test.tsx)
jest.mock('./PostCard', () => {
  // eslint-disable-next-line react/display-name
  return ({ post }: { post: Post }) => (
    // A simple mock that includes a test ID and some identifiable content from the post
    <div data-testid="mock-postcard">Post by {post.author.name} - ID: {post.id}</div>
  );
});

// Sample dummy posts data
const dummyPosts: Post[] = [
  { id: '1', author: { id: 'u1', name: 'Alice', avatarUrl: '' }, contentText: 'Post 1', timestamp: new Date(), likes: 0, commentsCount: 0 },
  { id: '2', author: { id: 'u2', name: 'Bob', avatarUrl: '' }, contentText: 'Post 2', timestamp: new Date(), likes: 0, commentsCount: 0 },
];

describe('PostList', () => {
  // Test case: renders multiple PostCard components for a list of posts
  it('should render a PostCard for each post in the list', () => {
    render(<PostList posts={dummyPosts} />);
    // Find all rendered mock PostCards
    const renderedPostCards = screen.getAllByTestId('mock-postcard');
    // Expect the number of rendered cards to match the number of posts
    expect(renderedPostCards).toHaveLength(dummyPosts.length);
    // Optionally, check if content from each post is present in the mocked output
    expect(screen.getByText('Post by Alice - ID: 1')).toBeInTheDocument();
    expect(screen.getByText('Post by Bob - ID: 2')).toBeInTheDocument();
  });

  // Test case: renders a message when the posts list is empty
  it('should render an empty state message if no posts are provided', () => {
    render(<PostList posts={[]} />); // Pass an empty array
    // Expect a message indicating no posts are available
    expect(screen.getByText(/No posts to display right now./i)).toBeInTheDocument();
    // Ensure no mock PostCards are rendered
    expect(screen.queryByTestId('mock-postcard')).not.toBeInTheDocument();
  });
});