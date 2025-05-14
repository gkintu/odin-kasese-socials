// src/components/users/UserListItem.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import UserListItem from './UserListItem';
import { ListedUser } from '@/types/user'; // Import our ListedUser type

describe('UserListItem', () => {
  const mockToggleFollow = jest.fn();

  const dummyUserFollowing: ListedUser = {
    id: 'user1',
    displayName: 'Followed User',
    avatarUrl: '/img/avatars/user1.png', // Ensure dummy images exist
    isFollowing: true,
  };

  const dummyUserNotFollowing: ListedUser = {
    id: 'user2',
    displayName: 'Unfollowed User',
    avatarUrl: '/img/avatars/user2.png',
    isFollowing: false,
  };

  beforeEach(() => {
    mockToggleFollow.mockClear();
  });

  // Test 1: Renders user information correctly
  it('should render user avatar, display name', () => {
    render(
      <UserListItem
        user={dummyUserFollowing}
        onToggleFollow={mockToggleFollow}
      />
    );

    // Check avatar (by alt text)
    expect(
      screen.getByAltText(`${dummyUserFollowing.displayName}'s avatar`)
    ).toBeInTheDocument();
    // Check display name
    expect(
      screen.getByText(dummyUserFollowing.displayName)
    ).toBeInTheDocument();
  });

  // Test 2: Renders "Unfollow" button if isFollowing is true
  it('should render "Unfollow" button if user.isFollowing is true', () => {
    render(
      <UserListItem
        user={dummyUserFollowing}
        onToggleFollow={mockToggleFollow}
      />
    );
    // Expect "Unfollow" button
    expect(
      screen.getByRole('button', { name: /^Unfollow /i })
    ).toBeInTheDocument();
    // Ensure "Follow" button is not present
    expect(
      screen.queryByRole('button', { name: /^Follow /i })
    ).not.toBeInTheDocument();
  });

  // Test 3: Renders "Follow" button if isFollowing is false
  it('should render "Follow" button if user.isFollowing is false', () => {
    render(
      <UserListItem
        user={dummyUserNotFollowing}
        onToggleFollow={mockToggleFollow}
      />
    );
    // Expect "Follow" button
    expect(
      screen.getByRole('button', { name: /^Follow /i })
    ).toBeInTheDocument();
    // Ensure "Unfollow" button is not present
    expect(
      screen.queryByRole('button', { name: /^Unfollow /i })
    ).not.toBeInTheDocument();
  });

  // Test 4: Calls onToggleFollow with user ID when button is clicked
  it('should call onToggleFollow with user ID when follow/unfollow button is clicked', () => {
    render(
      <UserListItem
        user={dummyUserNotFollowing}
        onToggleFollow={mockToggleFollow}
      />
    );
    const followButton = screen.getByRole('button', { name: /^Follow /i });
    fireEvent.click(followButton);
    // Expect onToggleFollow to be called with the correct user ID
    expect(mockToggleFollow).toHaveBeenCalledTimes(1);
    expect(mockToggleFollow).toHaveBeenCalledWith(dummyUserNotFollowing.id);
  });
});
