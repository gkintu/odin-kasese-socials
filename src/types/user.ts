// Interface for representing a user in a list, including follow status
export interface ListedUser {
  id: string;
  displayName: string;
  avatarUrl: string; // URL to the user's profile picture
  isFollowing: boolean; // Indicates if the current session user is following this listed user
}
