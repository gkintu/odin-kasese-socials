import { render, screen, fireEvent } from '@testing-library/react';
import UserList from './UserList';
import { ListedUser } from '@/types/user';

describe('UserList', () => {
  const mockToggleFollow = jest.fn();

  const dummyUsers: ListedUser[] = [
    {
      id: 'user1',
      displayName: 'Followed User',
      avatarUrl: '/img/avatars/user1.png',
      isFollowing: true,
    },
    {
      id: 'user2',
      displayName: 'Unfollowed User',
      avatarUrl: '/img/avatars/user2.png',
      isFollowing: false,
    },
  ];

  beforeEach(() => {
    mockToggleFollow.mockClear();
  });

  it('should render a list of users', () => {
    render(<UserList users={dummyUsers} onToggleFollow={mockToggleFollow} />);

    dummyUsers.forEach((user) => {
      expect(screen.getByText(user.displayName)).toBeInTheDocument();
      expect(screen.getByAltText(`${user.displayName}'s avatar`)).toBeInTheDocument();
    });
  });

  it('should call onToggleFollow when a follow/unfollow button is clicked', () => {
    render(<UserList users={dummyUsers} onToggleFollow={mockToggleFollow} />);

    const followButton = screen.getByRole('button', { name: /^Follow /i });
    fireEvent.click(followButton);

    expect(mockToggleFollow).toHaveBeenCalledTimes(1);
    expect(mockToggleFollow).toHaveBeenCalledWith(dummyUsers[1].id);
  });
});
