// src/components/posts/PostCard.tsx
import React from 'react';
import Image from 'next/image'; // For optimized images
import { Post } from '@/types/post'; // Our Post type
import { formatDistanceToNow } from 'date-fns'; // For formatting dates

// Define props for the PostCard component
interface PostCardProps {
  post: Post;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  // Destructure post object for easier access
  const { author, contentText, contentImageUrl, timestamp, likes, commentsCount } = post;

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
        <div className="w-full bg-gray-200"> {/* Container for image aspect ratio, if needed */}
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
          <span>{likes} likes</span>
          <span>{commentsCount} comments</span>
        </div>
        {/* Action Buttons: Like and Comment */}
        <div className="flex space-x-4">
          <button
            aria-label="Like post"
            className="flex-1 py-2 px-4 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
            // onClick={() => console.log('Like clicked for post:', post.id)} // Dummy action
          >
            {/* Icon placeholder (e.g., from an icon library) or Text */}
            Like
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