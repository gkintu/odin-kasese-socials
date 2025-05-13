// Defines the structure for a user object, often an author of a post
export interface PostAuthor {
  id: string;
  name: string;
  avatarUrl: string; // URL to the author's profile picture
}

// Defines the structure for a single post
export interface Post {
  id: string;
  author: PostAuthor; // The author of the post
  contentText: string; // The main text content of the post
  contentImageUrl?: string; // Optional URL for an image within the post
  timestamp: Date; // When the post was created (using Date object for flexibility with date-fns)
  likes: number; // Number of likes
  commentsCount: number; // Number of comments
}
