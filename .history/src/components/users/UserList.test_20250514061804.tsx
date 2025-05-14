// src/components/users/UserList.test.tsx
import { render, screen } from '@testing-library/react';
import UserList from './UserList';
import { ListedUser } from '@/types/user';

// Mock UserListItem to simplify testing UserList
jest.mock('./UserListItem', () => {
  // eslint-disable-next-line react/display-name
  return ({ user, onToggleFollow }: { user: ListedUser; onToggleFollow: (id: string) => void }) => (
    <div data-testid="mock-userlistitem" onClick={() => onToggleFollow(user.id)}>
      {user.displayName} - Following: {user.isFollowing.toString()}
    </div>
  );
});

const dummyUsers: ListedUser[] = [
  { id: 'u1', displayName: 'User One', avatarUrl: '', isFollowing: true },
  { id: 'u2', displayName: 'User Two', avatarUrl: '', isFollowing: false },
];

const mockPageToggleFollow = jest.fn();

describe('UserList', () => {
  beforeEach(() => {
    mockPageToggleFollow.mockClear();
  });

  // Test 1: Renders a UserListItem for each user
  it('should render a UserListItem for each user in the list', () => {
    render(<UserList users={dummyUsers} onToggleFollow={mockPageToggleFollow} />);
    const items = screen.getAllByTestId('mock-userlistitem');
    expect(items).toHaveLength(dummyUsers.length);
    // Check if content from users is passed down (via mock)
    expect(screen.getByText('User One - Following: true')).toBeInTheDocument();
    expect(screen.getByText('User Two - Following: false')).toBeInTheDocument();
  });

  // Test 2: Renders empty state message if no users
  it('should render an empty state message if no users are provided', () => {
    render(<UserList users={[]} onToggleFollow={mockPageToggleFollow} />);
    expect(screen.getByText(/No users found at this time./i)).toBeInTheDocument();
    expect(screen.queryByTestId('mock-userlistitem')).not.toBeInTheDocument();
  });

  // Test 3: Passes onToggleFollow to UserListItem (simulated by clicking the mock item)
  it('should pass the onToggleFollow handler to each UserListItem', () => {
    render(<UserList users={dummyUsers} onToggleFollow={mockPageToggleFollow} />);
    const firstUserItem = screen.getByText('User One - Following: true'); // Find one of the mock items
    fireEvent.click(firstUserItem); // Simulate the click that would trigger onToggleFollow in the mock
    expect(mockPageToggleFollow).toHaveBeenCalledTimes(1);
    expect(mockPageToggleFollow).toHaveBeenCalledWith(dummyUsers[0].id); // Check it was called with the first user's ID
  });
});