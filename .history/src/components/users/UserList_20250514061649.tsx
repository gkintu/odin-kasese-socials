import React from 'react';
import UserListItem from './UserListItem';
import { ListedUser } from '@/types/user';

type UserListProps = {
  users: ListedUser[];
  onToggleFollow: (userId: string) => void;
};

const UserList: React.FC<UserListProps> = ({ users, onToggleFollow }) => {
  return (
    <div>
      {users.map((user) => (
        <UserListItem key={user.id} user={user} onToggleFollow={onToggleFollow} />
      ))}
    </div>
  );
};

export default UserList;
