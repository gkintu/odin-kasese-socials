// src/components/profile/UserProfileDisplay.test.tsx
import { render, screen } from '@testing-library/react';
import UserProfileDisplay from './UserProfileDisplay';

describe('UserProfileDisplay', () => {
  const mockProps = {
    displayName: 'Test User',
    userEmail: 'test@example.com',
    bio: 'This is a test bio.',
    avatarUrl: '/img/default-avatar.png', // Using a local path for testing
  };

  it('should render user information correctly', () => {
    render(<UserProfileDisplay {...mockProps} />);

    // Check for profile picture (e.g., by alt text or a test ID)
    const profilePic = screen.getByAltText(/profile picture/i);
    expect(profilePic).toBeInTheDocument();
    expect(profilePic).toHaveAttribute('src', mockProps.avatarUrl);

    // Check for display name
    expect(screen.getByText(mockProps.displayName)).toBeInTheDocument();

    // Check for bio
    expect(screen.getByText(mockProps.bio)).toBeInTheDocument();
  });

  it('should display userEmail as name if displayName is not provided', () => {
    const propsWithoutDisplayName = { ...mockProps, displayName: undefined };
    render(<UserProfileDisplay {...propsWithoutDisplayName} />);
    expect(
      screen.getByRole('heading', { name: mockProps.userEmail, level: 1 }),
    ).toBeInTheDocument();
  });

  it('should render the avatar image with correct src and alt text', () => {
    render(<UserProfileDisplay {...mockProps} />);
    const avatarImage = screen.getByAltText(/profile picture/i);
    expect(avatarImage).toBeInTheDocument();
    expect(avatarImage).toHaveAttribute('src', mockProps.avatarUrl);
    expect(avatarImage).toHaveAttribute('alt', 'Profile picture');
  });

  it('should render the Your Posts section', () => {
    render(<UserProfileDisplay {...mockProps} />);
    expect(
      screen.getByRole('heading', { name: /your posts/i, level: 2 }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Your amazing posts will appear here soon!/i),
    ).toBeInTheDocument();
  });
});