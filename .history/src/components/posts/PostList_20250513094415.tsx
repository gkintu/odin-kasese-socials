// src/components/posts/PostList.tsx
import React from 'react';
import { Post } from '@/types/post'; // Import Post type
import PostCard from './PostCard';   // Import the actual PostCard component

// Define props for PostList
interface PostListProps {
  posts: Post[]; // Expects an array of Post objects
}

const PostList: React.FC<PostListProps> = ({ posts }) => {
  // Check if the posts array is empty
  if (!posts || posts.length === 0) {
    // If no posts, display an empty state message
    return (
      <div className="text-center text-gray-500 py-10">
        <p>No posts to display right now. Why not be the first?</p>
      </div>
    );
  }

  // If there are posts, map over them and render a PostCard for each
  return (
    <div className="space-y-6"> {/* Add some spacing between posts */}
      {posts.map((post) => (
        // Use post.id as the key for list rendering
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
};

export default PostList;