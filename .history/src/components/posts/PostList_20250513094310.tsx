import React from 'react';
import PostCard from './PostCard';

interface Post {
  id: string;
  title: string;
  content: string;
}

interface PostListProps {
  posts: Post[];
}

const PostList: React.FC<PostListProps> = ({ posts }) => {
  return (
    <div>
      {posts.map((post) => (
        <PostCard key={post.id} title={post.title} content={post.content} />
      ))}
    </div>
  );
};

export default PostList;
