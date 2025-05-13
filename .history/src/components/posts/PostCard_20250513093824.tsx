import React from 'react';
import { Post } from '../../types/post';

interface PostCardProps {
  post: Post;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  return (
    <div className="post-card">
      <h2>{post.author.name}</h2>
      <p>{post.contentText}</p>
      {post.contentImageUrl && <img src={post.contentImageUrl} alt="Post content" />}
      <div>
        <span>{post.likes} Likes</span>
        <span>{post.commentsCount} Comments</span>
      </div>
    </div>
  );
};

export default PostCard;
