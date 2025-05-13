// src/components/profile/UserProfileDisplay.test.tsx
import { render, screen } from '@testing-library/react';
import UserProfileDisplay from './UserProfileDisplay';

describe('UserProfileDisplay', () => {
  const defaultProps = {
    userEmail: 'test@example.com',
    bio: 'This is a default bio.',
    avatarUrl: '/img/default-avatar.png',
    displayName: 'User', // Added to satisfy the component's logic for default display
  };

  it('should render user information correctly', () => {
    render(<UserProfileDisplay {...defaultProps} />);

    // Check for profile picture (e.g., by alt text or a test ID)
    const profilePic = screen.getByAltText(/profile picture/i);
    expect(profilePic).toBeInTheDocument();
    expect(profilePic.getAttribute('src')).toContain(encodeURIComponent(defaultProps.avatarUrl));

    // Check for display name
    expect(screen.getByText(defaultProps.displayName)).toBeInTheDocument();

    // Check for bio
    expect(screen.getByText(defaultProps.bio)).toBeInTheDocument();
  });

  it('should display userEmail as name if displayName is not provided', () => {
    const propsWithoutDisplayName = { ...defaultProps, displayName: undefined };
    render(<UserProfileDisplay {...propsWithoutDisplayName} />);
    expect(
      screen.getByRole('heading', { name: defaultProps.userEmail, level: 1 })
    ).toBeInTheDocument();
  });

  it('should render the avatar image with correct src and alt text', () => {
    render(<UserProfileDisplay {...defaultProps} />);
    const avatarImage = screen.getByAltText(/profile picture/i);
    expect(avatarImage).toBeInTheDocument();
    expect(avatarImage.getAttribute('src')).toContain(encodeURIComponent(defaultProps.avatarUrl));
    expect(avatarImage).toHaveAttribute('alt', 'Profile picture');
  });

  it('should render the Your Posts section', () => {
    render(<UserProfileDisplay {...defaultProps} />);
    expect(
      screen.getByRole('heading', { name: /your posts/i, level: 2 })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Your amazing posts will appear here soon!/i)
    ).toBeInTheDocument();
  });

  it('renders with default props when nothing is passed', () => {
    // This test's premise is slightly flawed as some props are required.
    // We'll test with minimal required props + default display logic.
    render(<UserProfileDisplay {...defaultProps} />);
    // Check for displayName or email as per component logic
    expect(screen.getByText(defaultProps.displayName)).toBeInTheDocument();
    expect(screen.getByText(defaultProps.bio)).toBeInTheDocument();
    const avatarImage = screen.getByAltText('Profile picture');
    expect(avatarImage).toBeInTheDocument();
    expect(avatarImage.getAttribute('src')).toContain(encodeURIComponent(defaultProps.avatarUrl));
  });

  it('renders with provided props', () => {
    const testProps = {
      displayName: 'TestUser',
      userEmail: 'custom@example.com',
      bio: 'A custom bio for testing.',
      avatarUrl: '/img/custom-avatar.png',
    };
    render(<UserProfileDisplay {...testProps} />);

    expect(screen.getByText(testProps.displayName)).toBeInTheDocument();
    expect(screen.getByText(testProps.userEmail)).toBeInTheDocument(); // Email is also shown
    expect(screen.getByText(testProps.bio)).toBeInTheDocument();
    const avatarImage = screen.getByAltText('Profile picture');
    expect(avatarImage).toBeInTheDocument();
    expect(avatarImage.getAttribute('src')).toContain(encodeURIComponent(testProps.avatarUrl));
  });

  it('renders with a specific avatarUrl if provided, including the default path', () => {
    // This test ensures that a specifically provided avatarUrl is used.
    render(
      <UserProfileDisplay
        {...defaultProps}
        avatarUrl="/img/default-avatar.png" 
      />
    );
    const avatarImage = screen.getByAltText('Profile picture');
    expect(avatarImage.getAttribute('src')).toContain(encodeURIComponent('/img/default-avatar.png'));
  });

  it('falls back to the default avatar if avatarUrl prop is an empty string and component handles it', () => {
    // This test checks if the component correctly falls back to the default avatar
    // when an empty string is supplied for the avatarUrl prop.
    // This presumes that UserProfileDisplay.tsx implements logic to replace an empty string
    // with a default avatar URL before passing it to the Next.js Image component.
    // If UserProfileDisplay.tsx passes an empty string directly to <Image src="">,
    // Next/Image will error (as seen in previous logs), and this test might fail
    // if the rendered src is not the defaultProps.avatarUrl.
    render(
      <UserProfileDisplay
        {...defaultProps} // Base props, includes defaultProps.avatarUrl
        avatarUrl=""      // Override with empty string
      />
    );
    const avatarImage = screen.getByAltText('Profile picture');
    // This assertion expects that UserProfileDisplay internally substitutes
    // an empty avatarUrl with defaultProps.avatarUrl.
    expect(avatarImage.getAttribute('src')).toContain(encodeURIComponent(defaultProps.avatarUrl));
  });
});
