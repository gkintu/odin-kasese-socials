// src/components/profile/UserProfileDisplay.test.tsx
import { render, screen } from '@testing-library/react';
import UserProfileDisplay from './UserProfileDisplay';

describe('UserProfileDisplay', () => {
  // Define dummy props for the component
  const dummyProps = {
    displayName: 'Test User',
    userEmail: 'test@example.com', // Keep userEmail for potential use
    bio: 'This is a test bio for Kasese Socials.',
    avatarUrl: '/img/default-avatar.png', // Dummy avatar path
  };

  // Test case for rendering all profile elements
  it('should render profile picture, display name, bio, and posts area', () => {
    render(<UserProfileDisplay {...dummyProps} />);

    // Check for profile picture (e.g., by alt text or a test ID)
    // Using alt text assumes an <img> tag will be used
    const profilePic = screen.getByAltText(/profile picture/i);
    expect(profilePic).toBeInTheDocument();
    expect(profilePic).toHaveAttribute('src', dummyProps.avatarUrl);

    // Check for display name
    expect(screen.getByText(dummyProps.displayName)).toBeInTheDocument();

    // Check for bio
    expect(screen.getByText(dummyProps.bio)).toBeInTheDocument();

    // Check for a section indicating where posts would go (e.g., by a heading or test ID)
    expect(screen.getByRole('heading', { name: /your posts/i, level: 2 })).toBeInTheDocument();
  });

  // Test case for displaying email if displayName is not provided (optional behavior)
  it('should display userEmail as a fallback if displayName is not provided', () => {
    const propsWithoutDisplayName = { ...dummyProps, displayName: undefined };
    render(<UserProfileDisplay {...propsWithoutDisplayName} />);
    // Expect the email to be displayed if displayName is missing
    expect(screen.getByText(dummyProps.userEmail)).toBeInTheDocument();
  });
});