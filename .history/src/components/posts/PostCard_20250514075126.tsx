// src/components/posts/PostCard.tsx
import React, { useState } from 'react';
import Image from 'next/image'; // For optimized images
import toast from 'react-hot-toast';
import { Post } from '@/types/post'; // Our Post type
import { formatDistanceToNow } from 'date-fns'; // For formatting dates

// Define props for the PostCard component
interface PostCardProps {
  post: Post;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  // Destructure post object for easier access
  const {
    author,
    contentText,
    contentImageUrl,
    timestamp,
    commentsCount,
  } = post;

  const [isLikedByCurrentUser, setIsLikedByCurrentUser] = useState(false);
  const [currentLikes, setCurrentLikes] = useState(post.likes);

  const handleLikeToggle = () => {
    if (isLikedByCurrentUser) {
      setCurrentLikes((prevLikes) => prevLikes - 1);
      setIsLikedByCurrentUser(false);
      toast('Unliked post (dummy)', { icon: '💔' });
    } else {
      setCurrentLikes((prevLikes) => prevLikes + 1);
      setIsLikedByCurrentUser(true);
      toast.success('Liked post! (dummy)', { icon: '❤️' });
    }
    console.log(`Toggled like for post ${post.id}. New status: ${!isLikedByCurrentUser}`);
  };

  return (
    // Main card container with Tailwind styling
    <article className="bg-white shadow-lg rounded-lg overflow-hidden my-4">
      {/* Post Header: Author Info */}
      <div className="p-4 flex items-center">
        {/* Author Avatar */}
        <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
          <Image
            src={author.avatarUrl}
            alt={`${author.name}'s avatar`}
            width={40}
            height={40}
            className="object-cover w-full h-full"
          />
        </div>
        {/* Author Name and Timestamp */}
        <div>
          <p className="font-semibold text-gray-800">{author.name}</p>
          <p className="text-xs text-gray-500">
            {/* Format timestamp e.g., "about 2 hours ago" */}
            {formatDistanceToNow(new Date(timestamp), { addSuffix: true })}
          </p>
        </div>
      </div>

      {/* Post Content: Text */}
      <div className="p-4 border-t border-gray-200">
        <p className="text-gray-700 whitespace-pre-wrap">{contentText}</p>
      </div>

      {/* Post Content: Image (Optional) */}
      {contentImageUrl && (
        <div className="w-full bg-gray-200">
          {' '}
          {/* Container for image aspect ratio, if needed */}
          <Image
            src={contentImageUrl}
            alt="Post image"
            width={600} // Provide appropriate width, or use layout="responsive"
            height={400} // Provide appropriate height
            className="w-full h-auto object-contain" // Adjust object-fit as needed
            // layout="responsive" // Could also be used with a wrapper div for aspect ratio
          />
        </div>
      )}

      {/* Post Footer: Engagement Stats & Actions */}
      <div className="p-4 border-t border-gray-200">
        {/* Stats: Likes and Comments */}
        <div className="flex justify-between items-center text-sm text-gray-600 mb-2">
          <span>{currentLikes} likes</span>
          <span>{commentsCount} comments</span>
        </div>
        {/* Action Buttons: Like and Comment */}
        <div className="flex space-x-4">
          <button
            onClick={handleLikeToggle}
            aria-label={isLikedByCurrentUser ? "Unlike post" : "Like post"}
            className={`flex-1 py-2 px-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors
              ${
                isLikedByCurrentUser
                  ? 'bg-red-500 text-white border-red-500 hover:bg-red-600 focus:ring-red-400'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-100 focus:ring-indigo-500'
              }`}
          >
            {isLikedByCurrentUser ? '❤️ Liked' : '🤍 Like'}
          </button>
          <button
            aria-label="Comment on post"
            className="flex-1 py-2 px-4 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
            // onClick={() => console.log('Comment clicked for post:', post.id)} // Dummy action
          >
            {/* Icon placeholder or Text */}
            Comment
          </button>
        </div>
      </div>
    </article>
  );
};

export default PostCard;
