import React from 'react';
import { render, screen } from '@testing-library/react';
import UserProfileDisplay from './UserProfileDisplay';

describe('UserProfileDisplay', () => {
  it('renders user email, bio, and avatar', () => {
    const userEmail = 'test@example.com';
    const bio = 'This is a test bio.';
    const avatarUrl = '/path/to/avatar.png';

    render(<UserProfileDisplay userEmail={userEmail} bio={bio} avatarUrl={avatarUrl} />);

    expect(screen.getByText(userEmail)).toBeInTheDocument();
    expect(screen.getByText(bio)).toBeInTheDocument();
    expect(screen.getByAltText('User Avatar')).toHaveAttribute('src', avatarUrl);
  });
});
