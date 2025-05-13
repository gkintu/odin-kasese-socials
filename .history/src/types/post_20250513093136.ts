// Define the Post type for the application

export interface Post {
  id: string; // Unique identifier for the post
  title: string; // Title of the post
  content: string; // Content of the post
  authorId: string; // ID of the user who created the post
  createdAt: Date; // Timestamp when the post was created
  updatedAt: Date; // Timestamp when the post was last updated
}
